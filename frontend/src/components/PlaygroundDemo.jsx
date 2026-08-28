import { useState } from "react";
import { runPlayground } from "../services/api";

// Deliberately not @monaco-editor/react here: Monaco loads its worker from
// a CDN, which means the very first thing a visitor sees would depend on
// that CDN call succeeding before the hero even finishes rendering. The
// real Judge page (CodeEditor.jsx) still uses Monaco — that's a fair trade
// there, since the user has already committed to the app by that point.
// The landing page gets a plain, self-contained textarea instead.

const DEFAULT_CODE = `function solve(input) {
  const [a, b] = input.split(" ").map(Number);
  return a + b;
}`;

const VERDICT_LABEL = {
  ACCEPTED: "ACCEPTED",
  WRONG_ANSWER: "WRONG ANSWER",
  TIME_LIMIT_EXCEEDED: "TIME LIMIT EXCEEDED",
  RUNTIME_ERROR: "RUNTIME ERROR",
};

const VERDICT_COLOR = {
  ACCEPTED: "var(--success)",
  WRONG_ANSWER: "var(--error)",
  TIME_LIMIT_EXCEEDED: "var(--warning)",
  RUNTIME_ERROR: "var(--error)",
};

// Same chrome as the old scripted demo, but every run here hits the real
// backend and the real isolated-vm sandbox — this is the actual product,
// not a recording of it.
export default function PlaygroundDemo() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [status, setStatus] = useState("idle"); // idle | running | done | error
  const [result, setResult] = useState(null);
  const [shownCount, setShownCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRun = async () => {
    setStatus("running");
    setResult(null);
    setShownCount(0);
    setErrorMsg("");

    try {
      const data = await runPlayground(code);
      setResult(data);
      setStatus("done");

      // Reveal test results one at a time for a console-like feel, using
      // the real, already-returned results — no fake delay on the network
      // call itself, just on the reveal.
      data.results.forEach((_, i) => {
        setTimeout(() => setShownCount((n) => Math.max(n, i + 1)), (i + 1) * 220);
      });
    } catch (err) {
      setStatus("error");
      if (err.code === "ECONNABORTED") {
        setErrorMsg("Sandbox is taking a while to respond — it may be waking up. Try again in a few seconds.");
      } else if (err.response?.status === 429) {
        setErrorMsg("Too many runs in a row — wait a moment and try again.");
      } else if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Couldn't reach the sandbox right now. Try again shortly.");
      }
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden border shadow-2xl w-full max-w-md"
      style={{ background: "var(--panel)", borderColor: "var(--border)" }}
    >
      {/* title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#facc15" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4ade80" }} />
        <span className="ml-2 text-xs" style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}>
          submission.js — sandboxed
        </span>
      </div>

      {/* problem blurb */}
      <div className="px-5 pt-4 pb-2 text-xs" style={{ color: "var(--muted)" }}>
        <span style={{ color: "var(--text)" }} className="font-medium">Sum of Two Numbers</span>
        {" — "}given <code style={{ color: "var(--accent)" }}>input</code> as{" "}
        <code style={{ color: "var(--accent)" }}>"a b"</code>, return a + b. Edit the
        function, then run it for real.
      </div>

      {/* editor — plain textarea, styled like code, no CDN dependency */}
      <div className="px-5">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const el = e.target;
              const { selectionStart, selectionEnd } = el;
              const next = code.slice(0, selectionStart) + "  " + code.slice(selectionEnd);
              setCode(next);
              requestAnimationFrame(() => {
                el.selectionStart = el.selectionEnd = selectionStart + 2;
              });
            }
          }}
          spellCheck={false}
          rows={5}
          className="w-full rounded-lg border px-3 py-2.5 text-[13px] leading-relaxed resize-none focus:outline-none focus-visible:ring-2"
          style={{
            background: "#0a0812",
            borderColor: "var(--border)",
            color: "var(--text)",
            fontFamily: "var(--font-display)",
          }}
        />
      </div>

      {/* run control */}
      <div className="px-5 pt-4 flex items-center gap-3">
        <button
          onClick={handleRun}
          disabled={status === "running"}
          className="px-5 py-2 rounded-lg font-semibold text-sm transition hover:opacity-90 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ background: "var(--accent)", color: "#fff", outlineColor: "var(--accent)" }}
        >
          {status === "running" ? "Running…" : "Run"}
        </button>
        {status === "idle" && (
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            Runs in the same sandbox real submissions use.
          </span>
        )}
      </div>

      {/* output */}
      <div
        className="px-5 pb-5 pt-3 text-[13px] leading-relaxed min-h-[92px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {status === "error" && (
          <div style={{ color: "var(--warning)" }}>{errorMsg}</div>
        )}

        {(status === "running" || status === "done") && (
          <div style={{ color: "var(--muted)" }}>
            $ compiling in isolated V8 sandbox…
          </div>
        )}

        {(status === "running" || status === "done") && (
          <div className="mt-1" style={{ color: "var(--muted)" }}>
            Running {result ? result.results.length : 4} test cases…
          </div>
        )}

        {result &&
          result.results.slice(0, shownCount).map((r, i) => (
            <div
              key={i}
              className="flex justify-between"
              style={{ color: r.passed ? "var(--success)" : "var(--error)" }}
            >
              <span>
                {r.passed ? "✓" : "✗"} Test {i + 1}
              </span>
              <span style={{ color: "var(--muted)" }}>
                {r.runtimeMs != null ? `${r.runtimeMs}ms` : r.errorType}
              </span>
            </div>
          ))}

        {result && shownCount >= result.results.length && (
          <div
            className="mt-4 pt-4 border-t flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="font-semibold" style={{ color: VERDICT_COLOR[result.verdict] || "var(--text)" }}>
              Verdict: {VERDICT_LABEL[result.verdict] || result.verdict}
            </span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {result.totalRuntimeMs}ms
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
