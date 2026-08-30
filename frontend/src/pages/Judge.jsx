import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CodeEditor from "../components/CodeEditor";
import VerdictBadge from "../components/VerdictBadge";
import AIAnalysis from "../components/AIAnalysis";
import DiscussionList from "../components/DiscussionList";

import api from "../services/api";
import { analyzeCode } from "../services/aiService";

const DIFFICULTY_COLOR = {
  EASY: "var(--success)",
  MEDIUM: "var(--warning)",
  HARD: "var(--error)",
};

const AI_ACCENT = "#f472b6";

const DEFAULT_TEMPLATE = `function solve(input) {
  // Split input lines
  const lines = input.trim().split("\\n");

  // Example parsing:
  // const n = Number(lines[0]);
  // const arr = lines[1].split(" ").map(Number);

  // Write your solution here

  return "";
}`;

function Panel({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
      style={{ background: "var(--panel)", borderColor: "var(--border)" }}
    >
      {title && (
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export default function Judge() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [code, setCode] = useState(DEFAULT_TEMPLATE);

  const [verdict, setVerdict] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      }
    };

    fetchProblem();
  }, [id]);

  useEffect(() => {
    const savedCode = localStorage.getItem(`draft-${id}`);
    setCode(savedCode || DEFAULT_TEMPLATE);
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`draft-${id}`, code);
  }, [code, id]);

  const submitCode = async () => {
    try {
      setLoading(true);
      setVerdict("PENDING");
      setTestResults([]);

      const submission = await api.post("/submissions", {
        problemId: problem.id,
        code,
      });

      const submissionId = submission.data.id;

      const interval = setInterval(async () => {
        const res = await api.get(`/submissions/${submissionId}`);

        if (res.data.verdict !== "PENDING") {
          setVerdict(res.data.verdict);
          setTestResults(res.data.testResults || []);
          setLoading(false);
          clearInterval(interval);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setVerdict("ERROR");
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAiLoading(true);
      setAiError(false);
      setAiAnalysis(null);

      const result = await analyzeCode(problem.id, code);
      setAiAnalysis(result);
    } catch (err) {
      console.error(err);
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  };

  if (notFound) {
    return (
      <Panel>
        <p style={{ color: "var(--muted)" }}>
          That problem couldn't be found.{" "}
          <span
            onClick={() => navigate("/problems")}
            className="cursor-pointer hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Back to Problems
          </span>
        </p>
      </Panel>
    );
  }

  if (!problem) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border p-6 animate-pulse" style={{ background: "var(--panel)", borderColor: "var(--border)", height: 300 }} />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/problems")}
        className="text-sm mb-6 hover:opacity-80 transition"
        style={{ color: "var(--accent)" }}
      >
        ← Back to Problems
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT: problem info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {problem.title}
              </h1>
              <span
                className="px-3 py-1 text-xs rounded-lg font-semibold"
                style={{
                  background: `color-mix(in srgb, ${DIFFICULTY_COLOR[problem.difficulty]} 18%, transparent)`,
                  color: DIFFICULTY_COLOR[problem.difficulty] || "var(--text)",
                }}
              >
                {problem.difficulty}
              </span>
            </div>

            {problem.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {problem.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full"
                    style={{ background: "var(--border)", color: "var(--muted)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Panel>
            <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              {problem.description}
            </p>
          </Panel>

          {problem.testCases?.length > 0 && (
            <Panel title="Examples">
              <div className="space-y-3">
                {problem.testCases.map((ex, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border text-sm"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                  >
                    <div style={{ color: "var(--muted)" }}>
                      Input: <span style={{ color: "var(--text)" }}>{ex.input}</span>
                    </div>
                    <div style={{ color: "var(--muted)" }}>
                      Output: <span style={{ color: "var(--text)" }}>{ex.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-4">Discussion</h2>
            <DiscussionList problemId={problem.id} />
          </div>
        </div>

        {/* RIGHT: editor + judging */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                JavaScript
              </div>

              <button
                onClick={() => setCode(DEFAULT_TEMPLATE)}
                className="px-3 py-1 rounded-lg text-sm border transition hover:border-[var(--accent)]"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              >
                Reset Code
              </button>
            </div>

            <div
              className="border rounded-lg overflow-hidden"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="h-[420px]">
                <CodeEditor code={code} setCode={setCode} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <button
                onClick={submitCode}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg font-semibold transition hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {loading ? "Running…" : "Submit"}
              </button>

              <button
                onClick={handleAnalyze}
                disabled={aiLoading}
                className="px-6 py-2.5 rounded-lg font-semibold transition hover:opacity-90 disabled:opacity-60"
                style={{ background: AI_ACCENT, color: "#fff" }}
              >
                {aiLoading ? "Analyzing…" : "Analyze with AI"}
              </button>

              <VerdictBadge verdict={verdict} />
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <Panel title="Test Results">
              <div className="space-y-2">
                {testResults.map((t, i) => (
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

                    <div
                      className="mt-1 font-semibold"
                      style={{ color: t.passed ? "var(--success)" : "var(--error)" }}
                    >
                      {t.passed ? "✓ Passed" : "✗ Failed"}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* AI Analysis */}
          {aiError && (
            <div
              className="rounded-lg border px-4 py-3 text-sm"
              style={{ borderColor: "var(--warning)", color: "var(--warning)" }}
            >
              AI analysis failed. Try again in a moment.
            </div>
          )}

          {aiAnalysis && (
            <Panel title="AI Analysis">
              <AIAnalysis analysis={aiAnalysis} />
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
