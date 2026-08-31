// Runs code in a non-JS language inside an E2B sandbox — a real, ephemeral
// Linux VM reached over their API (not something running on this server).
//
// This is a separate execution path from codeRunner.js (which handles
// JavaScript locally in an isolated-vm sandbox). It only ever runs for the
// authenticated /submissions flow, never for the public landing-page
// playground endpoint — that endpoint is unauthenticated and rate-limited
// per IP, and it must never be able to spend someone's E2B credit.
//
// Setup required (see .env.example):
//   E2B_API_KEY - free at https://e2b.dev (Hobby tier: $100 credit,
//                 no credit card required)
//
// Each submission gets its own fresh sandbox, used once and destroyed —
// there's no persistent server to provision or maintain.
const { Sandbox, TimeoutError } = require("e2b");

const WORKDIR = "/home/user";

// Self-healing: if the compiler isn't in the sandbox's default image, this
// installs it before compiling. Slower on a cold sandbox, but works
// regardless of what the default E2B template includes. If you want faster
// C++/Java runs later, build a custom E2B template with these preinstalled
// and reference it in Sandbox.create() below.
const ENSURE_TOOLCHAIN = {
  cpp: "command -v g++ >/dev/null 2>&1 || (apt-get update -qq && apt-get install -y -qq g++)",
  java: "command -v javac >/dev/null 2>&1 || (apt-get update -qq && apt-get install -y -qq default-jdk)",
};

async function runViaE2B(code, input, language, timeoutMs = 5000) {
  if (!process.env.E2B_API_KEY) {
    throw { type: "RUNTIME_ERROR", error: "E2B is not configured on this server (missing E2B_API_KEY)." };
  }

  if (!["python", "cpp", "java"].includes(language)) {
    throw { type: "RUNTIME_ERROR", error: `Unsupported language: ${language}` };
  }

  let sbx;
  try {
    sbx = await Sandbox.create({ timeoutMs: Math.max(timeoutMs + 15000, 20000) });

    await sbx.files.write(`${WORKDIR}/input.txt`, input);

    let runCommand;

    if (language === "python") {
      await sbx.files.write(`${WORKDIR}/solution.py`, code);
      runCommand = `python3 ${WORKDIR}/solution.py < ${WORKDIR}/input.txt`;
    }

    if (language === "cpp") {
      await sbx.files.write(`${WORKDIR}/solution.cpp`, code);
      await sbx.commands.run(ENSURE_TOOLCHAIN.cpp, { timeoutMs: 60000 });

      const compile = await sbx.commands.run(
        `g++ -O2 -std=c++17 -o ${WORKDIR}/solution ${WORKDIR}/solution.cpp`,
        { timeoutMs: 20000 }
      );
      if (compile.exitCode !== 0) {
        throw { type: "RUNTIME_ERROR", error: `Compilation error: ${compile.stderr || "unknown"}` };
      }
      runCommand = `${WORKDIR}/solution < ${WORKDIR}/input.txt`;
    }

    if (language === "java") {
      await sbx.files.write(`${WORKDIR}/Main.java`, code);
      await sbx.commands.run(ENSURE_TOOLCHAIN.java, { timeoutMs: 60000 });

      const compile = await sbx.commands.run(`javac ${WORKDIR}/Main.java`, {
        cwd: WORKDIR,
        timeoutMs: 20000,
      });
      if (compile.exitCode !== 0) {
        throw { type: "RUNTIME_ERROR", error: `Compilation error: ${compile.stderr || "unknown"}` };
      }
      runCommand = `java -cp ${WORKDIR} Main < ${WORKDIR}/input.txt`;
    }

    let result;
    try {
      result = await sbx.commands.run(runCommand, { cwd: WORKDIR, timeoutMs });
    } catch (err) {
      if (err instanceof TimeoutError) {
        throw { type: "TLE", error: "Time limit exceeded" };
      }
      throw err;
    }

    if (result.exitCode !== 0) {
      throw { type: "RUNTIME_ERROR", error: result.stderr || "Runtime error" };
    }

    return { output: result.stdout ?? "" };
  } catch (err) {
    // Re-throw our own shaped errors as-is; wrap anything unexpected
    // (network errors, E2B SDK errors) so judge.service.js always gets a
    // consistent { type, error } shape.
    if (err && err.type) throw err;
    throw { type: "RUNTIME_ERROR", error: err?.message || "Sandbox execution failed" };
  } finally {
    if (sbx) {
      await sbx.kill().catch(() => {});
    }
  }
}

module.exports = { runViaE2B };
