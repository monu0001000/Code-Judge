import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CodeEditor from "../components/CodeEditor";
import VerdictBadge from "../components/VerdictBadge";
import AIAnalysis from "../components/AIAnalysis";
import DiscussionList from "../components/DiscussionList";

import api from "../services/api";
import { analyzeCode } from "../services/aiService";

export default function Judge() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ------------------ UNIVERSAL TEMPLATE ------------------

  const DEFAULT_TEMPLATE = `function solve(input) {
  // Split input lines
  const lines = input.trim().split("\\n");

  // Example parsing:
  // const n = Number(lines[0]);
  // const arr = lines[1].split(" ").map(Number);

  // Write your solution here

  return "";
}`;

  // ------------------ STATE ------------------

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(DEFAULT_TEMPLATE);

  const [verdict, setVerdict] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ------------------ FETCH PROBLEM ------------------

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error(err);
        navigate("/problems");
      }
    };

    fetchProblem();
  }, [id, navigate]);

  // ------------------ LOAD DRAFT ------------------

  useEffect(() => {
    const savedCode = localStorage.getItem(`draft-${id}`);

    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(DEFAULT_TEMPLATE);
    }
  }, [id]);

  // ------------------ AUTO SAVE DRAFT ------------------

  useEffect(() => {
    localStorage.setItem(`draft-${id}`, code);
  }, [code, id]);

  // ------------------ SUBMIT CODE ------------------

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

  // ------------------ AI ANALYSIS ------------------

  const handleAnalyze = async () => {
    try {
      setAiLoading(true);
      setAiAnalysis(null);

      const result = await analyzeCode(problem.id, code);
      setAiAnalysis(result);

    } catch (err) {
      console.error(err);
      alert("AI analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  // ------------------ LOADING ------------------

  if (!problem) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-slate-900">
        Loading problem...
      </div>
    );
  }

  // ------------------ UI ------------------

  return (
    <div className="flex h-screen bg-slate-900 text-white">

      {/* LEFT SIDE */}
      <div className="w-[40%] p-6 border-r border-slate-700 overflow-y-auto">

        <button
          onClick={() => navigate("/problems")}
          className="text-cyan-400 mb-4"
        >
          ← Back to Problems
        </button>

        <h1 className="text-2xl font-bold">{problem.title}</h1>

        <span className="inline-block mt-2 mb-4 px-3 py-1 rounded bg-green-500 text-black font-semibold">
          {problem.difficulty}
        </span>

        <p className="whitespace-pre-wrap">{problem.description}</p>

        <h3 className="mt-6 font-semibold">Examples</h3>

        {problem.testCases?.map((ex, i) => (
          <div key={i} className="mt-3 p-3 bg-slate-800 rounded">
            <div><strong>Input:</strong> {ex.input}</div>
            <div><strong>Output:</strong> {ex.output}</div>
          </div>
        ))}

        {/* DISCUSSIONS */}

        <div className="mt-10 border-t border-slate-700 pt-6">
          <h2 className="text-xl font-semibold mb-4">Discussion</h2>
          <DiscussionList problemId={problem.id} />
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-[60%] p-6 overflow-y-auto">

        {/* Editor Toolbar */}

        <div className="flex justify-between items-center mb-2">

          <div className="text-sm text-slate-400">
            JavaScript
          </div>

          <button
            onClick={() => setCode(DEFAULT_TEMPLATE)}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm"
          >
            Reset Code
          </button>

        </div>

        {/* Editor */}

        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <div className="h-[480px]">
            <CodeEditor code={code} setCode={setCode} />
          </div>
        </div>

        {/* Buttons */}

        <div className="mt-4 flex items-center gap-4">

          <button
            onClick={submitCode}
            disabled={loading}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold shadow"
          >
            {loading ? "Running..." : "Submit"}
          </button>

          <button
            onClick={handleAnalyze}
            disabled={aiLoading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold shadow"
          >
            {aiLoading ? "Analyzing..." : "Analyze with AI"}
          </button>

          <VerdictBadge verdict={verdict} />

        </div>

        {/* Test Results */}

        {testResults.length > 0 && (
          <div className="mt-6">

            <h3 className="font-semibold mb-3">
              Test Results
            </h3>

            {testResults.map((t, i) => (
              <div
                key={i}
                className={`mt-2 p-3 rounded ${
                  t.passed ? "bg-green-900" : "bg-red-900"
                }`}
              >
                <div>Input: {t.input}</div>
                <div>Expected: {t.expected}</div>
                <div>Output: {t.output}</div>
                <div>{t.passed ? "✅ Passed" : "❌ Failed"}</div>
              </div>
            ))}

          </div>
        )}

        {/* AI ANALYSIS */}

        {aiAnalysis && (
          <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
            <AIAnalysis analysis={aiAnalysis} />
          </div>
        )}

      </div>
    </div>
  );
}