const prisma = require("../prismaClient");
const { runCodeWithInput } = require("./codeRunner");

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
    const testCases = submission.problem?.testCases || [];

    const results = [];
    let verdict = "ACCEPTED";
    let totalRuntime = 0;

    for (const tc of testCases) {
      try {
        const start = Date.now();

        const res = await runCodeWithInput(code, tc.input);

        const duration = Date.now() - start;
        totalRuntime += duration;

        if (res.type === "OK") {
          const expected = String(tc.output).trim();
          const output = String(res.output).trim();

          const passed = output === expected;

          results.push({
            input: tc.input,
            expected,
            output,
            passed,
            runtimeMs: duration
          });

          if (!passed) {
            verdict = "WRONG_ANSWER";
          }
        } else {
          results.push({
            input: tc.input,
            expected: tc.output,
            output: null,
            passed: false,
            errorType: res.type
          });

          verdict = "RUNTIME_ERROR";
        }

      } catch (err) {
        if (err && err.type === "TLE") {
          results.push({
            input: tc.input,
            expected: tc.output,
            output: null,
            passed: false,
            errorType: "TLE"
          });

          verdict = "JUDGE_TIMEOUT";
          break;
        } else {
          results.push({
            input: tc.input,
            expected: tc.output,
            output: null,
            passed: false,
            errorType: err?.type || "RUNTIME_ERROR",
            message: err?.error || String(err)
          });

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
        data: { verdict: "ERROR" }
      });
    } catch (e) {}
  }
}

module.exports = { judgeSubmission };
