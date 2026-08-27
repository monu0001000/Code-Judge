const { runCodeWithInput } = require("../services/codeRunner");

// The landing page only ever demos this one fixed problem — "sum of two
// numbers" — so the test cases live here rather than in the DB. No
// submission row is created: this endpoint never touches Prisma.
const DEMO_TEST_CASES = [
  { input: "2 3", output: "5" },
  { input: "-1 4", output: "3" },
  { input: "0 0", output: "0" },
  { input: "100 250", output: "350" },
];

const MAX_CODE_LENGTH = 2000;
const PLAYGROUND_TIMEOUT_MS = 2000;

// Simple in-memory fixed-window limiter, keyed by IP. Good enough for a
// public demo endpoint on a single long-running process — this is not meant
// to survive a multi-instance deployment, only to stop one visitor's browser
// from hammering the sandbox.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const hits = new Map(); // ip -> { count, windowStart }

function isRateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

exports.runPlayground = async (req, res) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";

    if (isRateLimited(ip)) {
      return res.status(429).json({
        message: "Too many runs — wait a moment and try again.",
      });
    }

    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Missing code" });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({
        message: `Code is too long for the demo sandbox (max ${MAX_CODE_LENGTH} characters).`,
      });
    }

    const results = [];
    let verdict = "ACCEPTED";
    let totalRuntimeMs = 0;

    for (const tc of DEMO_TEST_CASES) {
      try {
        const start = Date.now();
        const out = await runCodeWithInput(code, tc.input, PLAYGROUND_TIMEOUT_MS);
        const duration = Date.now() - start;
        totalRuntimeMs += duration;

        const expected = String(tc.output).trim();
        const output = String(out.output).trim();
        const passed = output === expected;

        results.push({ input: tc.input, expected, output, passed, runtimeMs: duration });

        if (!passed) verdict = "WRONG_ANSWER";
      } catch (err) {
        const errType = err?.type || "RUNTIME_ERROR";
        results.push({
          input: tc.input,
          expected: tc.output,
          output: null,
          passed: false,
          errorType: errType,
          message: err?.error,
        });

        verdict = errType === "TLE" ? "TIME_LIMIT_EXCEEDED" : "RUNTIME_ERROR";
        break;
      }
    }

    return res.json({ verdict, results, totalRuntimeMs });
  } catch (err) {
    console.error("Playground run error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
