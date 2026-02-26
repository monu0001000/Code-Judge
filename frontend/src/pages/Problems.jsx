import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AIAnalysis from "../components/AIAnalysis";

export default function Problems() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await api.get("/problems");
      setProblems(res.data);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    }
  };
  const handleAnalyze = async () => {
  try {
    setLoading(true);

    const result = await analyzeCode(problem.id, userCode);

    setAnalysis(result);

  } catch (err) {
    alert("AI analysis failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Problems</h1>

       


        <div className="space-y-4">
          {problems.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/judge/${p.id}`)}
              className="bg-slate-800 hover:bg-slate-700 transition p-5 rounded-xl cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">{p.title}</h2>
                <span
                  className={`px-3 py-1 text-sm rounded-lg ${
                    p.difficulty === "EASY"
                      ? "bg-green-500 text-black"
                      : p.difficulty === "MEDIUM"
                      ? "bg-yellow-400 text-black"
                      : "bg-red-500"
                  }`}
                >
                  {p.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
