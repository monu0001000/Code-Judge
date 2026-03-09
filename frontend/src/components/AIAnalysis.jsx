export default function AIAnalysis({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="space-y-6">

      {/* Logic */}
      <Section
        title="Logic"
        content={analysis.logic}
      />

      {/* Edge Cases */}
      <Section
        title="Edge Cases"
        content={analysis.edgeCases}
      />

      {/* Time Complexity */}
      <Section
        title="Time Complexity"
        content={analysis.timeComplexity}
      />

      {/* Improvement */}
      <Section
        title="Improvement"
        content={analysis.improvement}
      />

      {/* Improved Code */}
      {analysis.improvedCode && (
        <div>
          <h3 className="text-purple-400 font-semibold mb-2">
            Improved Code
          </h3>

          <pre className="bg-slate-900 border border-slate-700 p-4 rounded-lg overflow-x-auto text-sm">
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
      <h3 className="text-purple-400 font-semibold mb-2">
        {title}
      </h3>

      <p className="text-slate-300 leading-relaxed">
        {content}
      </p>
    </div>
  );
}