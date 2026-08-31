const prisma = require("../prismaClient");
const { runCodeWithInput } = require("./codeRunner");
const { runViaE2B } = require("./e2bRunner");

function runForLanguage(code, input, language, timeoutMs) {
  if (!language || language === "javascript") {
    return runCodeWithInput(code, input, timeoutMs);
  }
  return runViaE2B(code, input, language, timeoutMs);
}

function buildTestResult(testCase, details) {
  const result = {
    isSample: testCase.isSample,
    ...details
  };

  // Hidden test data must never be persisted in a form that the submission
  // owner can retrieve. They receive only pass/fail and timing information.
  if (!testCase.isSample) {
    return result;
  }

  return {
    ...result,
    input: testCase.input,
    expected: String(testCase.output).trim()
  };
}

async function judgeSubmission(submissionId) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        problem: {
          include: { testCases: true }
        }
      }
    });

    if (!submission) return;

    const code = submission.code;
    const language = submission.language || "javascript";
    const testCases = submission.problem?.testCases || [];

    const results = [];
    let verdict = "ACCEPTED";
    let totalRuntime = 0;

    for (const tc of testCases) {
      try {
        const start = Date.now();

        const res = await runForLanguage(code, tc.input, language);

        const duration = Date.now() - start;
        totalRuntime += duration;

        if (res.type === "OK") {
          const expected = String(tc.output).trim();
          const output = String(res.output).trim();

          const passed = output === expected;

          results.push(buildTestResult(tc, {
            output,
            passed,
            runtimeMs: duration
          }));

          if (!passed) {
            verdict = "WRONG_ANSWER";
          }
        } else {
          results.push(buildTestResult(tc, {
            output: null,
            passed: false,
            errorType: res.type
          }));

          verdict = "RUNTIME_ERROR";
        }

      } catch (err) {
        if (err && err.type === "TLE") {
          results.push(buildTestResult(tc, {
            output: null,
            passed: false,
            errorType: "TLE"
          }));

          verdict = "TIME_LIMIT_EXCEEDED";
          break;
        } else {
          results.push(buildTestResult(tc, {
            output: null,
            passed: false,
            errorType: err?.type || "RUNTIME_ERROR",
            ...(tc.isSample ? { message: err?.error || String(err) } : {})
          }));

          verdict = verdict === "ACCEPTED" ? "RUNTIME_ERROR" : verdict;
        }
      }
    }

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        verdict,
        runtimeMs: totalRuntime || null,
        testResults: results.length ? results : null
      }
    });

    return { verdict, testResults: results };

  } catch (err) {
    console.error("Judge error:", err);

    try {
      await prisma.submission.update({
        where: { id: submissionId },
        data: { verdict: "RUNTIME_ERROR" }
      });
    } catch (e) {}
  }
}

module.exports = { judgeSubmission };
