import VerdictBadge from "./VerdictBadge";

// Shared by SubmissionModal (popup, used from Profile) and SubmissionView
// (full page, used from Dashboard) so both entry points into "look at one
// submission" stay visually identical by construction, not by remembering
// to update both.
export default function SubmissionDetails({ submission }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          {submission.problem?.title}
        </h2>
        <VerdictBadge verdict={submission.verdict} />
      </div>

      <div className="text-sm flex gap-4 flex-wrap" style={{ color: "var(--muted)" }}>
        <span>Submitted {new Date(submission.createdAt).toLocaleString()}</span>
        {submission.runtimeMs != null && <span>{submission.runtimeMs} ms</span>}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
          Code
        </h3>
        <pre
          className="p-4 rounded-lg overflow-x-auto text-sm border whitespace-pre-wrap"
          style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)", fontFamily: "var(--font-display)" }}
        >
          <code>{submission.code}</code>
        </pre>
      </div>

      {submission.testResults?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Test Results
          </h3>

          <div className="space-y-2">
            {submission.testResults.map((t, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border-l-4 text-sm"
                style={{
                  background: `color-mix(in srgb, ${t.passed ? "var(--success)" : "var(--error)"} 10%, var(--bg))`,
                  borderColor: t.passed ? "var(--success)" : "var(--error)",
                }}
              >
                {t.isSample !== false ? (
                  <div className="space-y-0.5" style={{ fontFamily: "var(--font-display)" }}>
                    <div style={{ color: "var(--muted)" }}>
                      Input: <span style={{ color: "var(--text)" }}>{t.input}</span>
                    </div>
                    <div style={{ color: "var(--muted)" }}>
                      Expected: <span style={{ color: "var(--text)" }}>{t.expected}</span>
                    </div>
                    <div style={{ color: "var(--muted)" }}>
                      Output: <span style={{ color: "var(--text)" }}>{t.output ?? "—"}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "var(--muted)" }}>Hidden test {i + 1}</div>
                )}

                {t.errorType && (
                  <div className="mt-1" style={{ color: "var(--error)" }}>
                    Error: {t.errorType}
                  </div>
                )}

                <div className="mt-1 font-semibold" style={{ color: t.passed ? "var(--success)" : "var(--error)" }}>
                  {t.passed ? "✓ Passed" : "✗ Failed"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
