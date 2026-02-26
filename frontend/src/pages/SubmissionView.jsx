import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import VerdictBadge from "../components/VerdictBadge";

export default function SubmissionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await api.get(`/submissions/${id}`);
        setSubmission(res.data);
      } catch (err) {
        console.error("Failed to fetch submission", err);
      }
    };

    fetchSubmission();
  }, [id]);

  if (!submission) {
    return (
      <div className="p-8 text-white">
        Loading submission...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">

      <button
        onClick={() => navigate(-1)}
        className="text-cyan-400"
      >
        ← Back
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {submission.problem?.title}
        </h1>

        <VerdictBadge verdict={submission.verdict} />
      </div>

      <div className="text-slate-400 text-sm">
        Submitted at: {new Date(submission.createdAt).toLocaleString()}
      </div>

      {/* CODE BLOCK */}
      <div className="bg-slate-800 p-6 rounded-lg overflow-x-auto">
        <pre className="text-sm whitespace-pre-wrap">
          {submission.code}
        </pre>
      </div>

      {/* TEST RESULTS */}
      {submission.testResults?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Test Results
          </h3>

          {submission.testResults.map((t, i) => (
            <div
              key={i}
              className={`p-4 rounded mb-3 ${
                t.passed ? "bg-green-900" : "bg-red-900"
              }`}
            >
              <div><strong>Input:</strong> {t.input}</div>
              <div><strong>Expected:</strong> {t.expected}</div>
              <div><strong>Output:</strong> {t.output}</div>
              <div>
                {t.passed ? "✅ Passed" : "❌ Failed"}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}