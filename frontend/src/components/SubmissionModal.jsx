export default function SubmissionModal({ submission, onClose }) {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 w-3/4 max-h-[80vh] overflow-y-auto rounded-xl p-6">
        <button
          onClick={onClose}
          className="text-red-400 float-right"
        >
          Close
        </button>

        <h2 className="text-xl font-bold mb-4">
          {submission.problem.title}
        </h2>

        <div className="mb-3">
          Verdict:
          <span className={`ml-2 px-3 py-1 rounded ${
            submission.verdict === "ACCEPTED"
              ? "bg-green-500 text-black"
              : "bg-red-500"
          }`}>
            {submission.verdict}
          </span>
        </div>

        <div className="mb-3">
          Runtime: {submission.runtimeMs} ms
        </div>

        <h3 className="font-semibold mt-4 mb-2">Code</h3>
        <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
          {submission.code}
        </pre>

        <h3 className="font-semibold mt-6 mb-2">Test Results</h3>

        {submission.testResults?.map((t, i) => (
          <div
            key={i}
            className={`p-3 mt-2 rounded ${
              t.passed ? "bg-green-900" : "bg-red-900"
            }`}
          >
            <div>Input: {t.input}</div>
            <div>Expected: {t.expected}</div>
            <div>Output: {t.output}</div>
          </div>
        ))}
      </div>
    </div>
  );
}