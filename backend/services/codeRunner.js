const ivm = require("isolated-vm");

const MEMORY_LIMIT_MB = 64;
const DEFAULT_TIMEOUT_MS = 3000;
const MAX_OUTPUT_CHARS = 64 * 1024;

/**
 * Runs untrusted user code inside a fully isolated V8 context (separate heap,
 * no access to Node APIs, no filesystem, no network, no access to the host
 * process). This replaces the old approach of exec()-ing user code directly
 * as a child process on the host, which gave submitted code full access to
 * the server (filesystem, network, ability to spawn further processes, etc).
 *
 * isolated-vm gives us:
 *  - a separate V8 isolate (own heap) with a hard memory ceiling
 *  - a wall-clock execution timeout enforced by the isolate itself
 *  - zero access to `require`, `process`, `fs`, or any Node global unless we
 *    explicitly inject it
 */
function runCodeWithInput(userCode, input, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return new Promise(async (resolve, reject) => {
    let isolate;

    try {
      isolate = new ivm.Isolate({ memoryLimit: MEMORY_LIMIT_MB });
      const context = await isolate.createContext();
      const jail = context.global;
      await jail.set("global", jail.derefInto());

      // Collect anything the sandboxed code "prints" so we can return it
      // as the program's stdout-equivalent, same shape the old exec()-based
      // runner produced.
      const outputLines = [];
      await jail.set(
        "_hostLog",
        new ivm.Reference((...args) => {
          outputLines.push(args.map(String).join(" "));
        })
      );

      // Minimal console shim inside the sandbox — the sandbox has no real
      // console, fs, process, or require, so this is the only way user code
      // can surface output.
      const bootstrap = `
        let printedCharacters = 0;
        const console = {
          log: (...args) => {
            const values = args.map(String);
            printedCharacters += values.join(" ").length + 1;
            if (printedCharacters > ${MAX_OUTPUT_CHARS}) {
              throw new Error("Output limit exceeded");
            }
            _hostLog.applySync(undefined, values);
          },
          error: (...args) => {
            const values = args.map(String);
            printedCharacters += values.join(" ").length + 1;
            if (printedCharacters > ${MAX_OUTPUT_CHARS}) {
              throw new Error("Output limit exceeded");
            }
            _hostLog.applySync(undefined, values);
          },
        };
      `;

      const wrappedCode = `
        ${bootstrap}
        ${userCode}

        (function () {
          try {
            const result = solve(${JSON.stringify(input)});
            console.log(result === undefined ? "" : result);
          } catch (err) {
            throw new Error(err && err.message ? err.message : String(err));
          }
        })();
      `;

      const script = await isolate.compileScript(wrappedCode);

      await script.run(context, { timeout: timeoutMs });

      resolve({
        type: "OK",
        output: outputLines.join("\n").trim(),
      });
    } catch (err) {
      const message = err && err.message ? err.message : String(err);

      if (message.includes("Script execution timed out")) {
        return reject({ type: "TLE" });
      }

      if (
        message.includes("Isolate was disposed") ||
        message.includes("Array buffer allocation failed") ||
        message.includes("over memory limit")
      ) {
        return reject({
          type: "RUNTIME_ERROR",
          error: "Memory limit exceeded",
        });
      }

      return reject({
        type: "RUNTIME_ERROR",
        error: message,
      });
    } finally {
      if (isolate) {
        try {
          isolate.dispose();
        } catch (_) {}
      }
    }
  });
}

module.exports = { runCodeWithInput };
