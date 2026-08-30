export default function AIAnalysis({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <Section title="Logic" content={analysis.logic} />
      <Section title="Edge Cases" content={analysis.edgeCases} />
      <Section title="Time Complexity" content={analysis.timeComplexity} />
      <Section title="Improvement" content={analysis.improvement} />

      {analysis.improvedCode && (
        <div>
          <h3
            className="font-semibold mb-2 text-sm uppercase tracking-wide"
            style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
          >
            Improved Code
          </h3>

          <pre
            className="p-4 rounded-lg overflow-x-auto text-sm border"
            style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
          >
            <code>{analysis.improvedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

function Section({ title, content }) {
  if (!content) return null;

  return (
    <div>
      <h3
        className="font-semibold mb-2 text-sm uppercase tracking-wide"
        style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>

      <p className="leading-relaxed" style={{ color: "var(--text)" }}>
        {content}
      </p>
    </div>
  );
}
