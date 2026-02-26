import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import VerdictBadge from "../components/VerdictBadge";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/submissions/dashboard");

        setStats(res.data.stats);
        setRecent(res.data.submissions.slice(0, 5));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8">
        Welcome back 👋
      </h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-4 gap-6 mb-12">

        <div className="bg-slate-800 p-6 rounded">
          <div className="text-slate-400 text-sm">Problems Solved</div>
          <div className="text-2xl font-bold text-green-400">
            {stats?.solvedProblems}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded">
          <div className="text-slate-400 text-sm">Total Submissions</div>
          <div className="text-2xl font-bold">
            {stats?.totalSubmissions}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded">
          <div className="text-slate-400 text-sm">Acceptance Rate</div>
          <div className="text-2xl font-bold text-cyan-400">
            {stats?.acceptanceRate}%
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded">
          <div className="text-slate-400 text-sm">Fastest Runtime</div>
          <div className="text-2xl font-bold text-purple-400">
            {stats?.fastestRuntime ?? "-"} ms
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="flex gap-4 mb-12">
        <button
          onClick={() => navigate("/problems")}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded font-semibold"
        >
          Solve Problems
        </button>

        <button
          onClick={() => navigate("/leaderboard")}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded font-semibold"
        >
          Leaderboard
        </button>
      </div>

      {/* RECENT SUBMISSIONS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Recent Submissions
        </h2>

        {recent.length === 0 && (
          <p className="text-slate-500">
            No submissions yet.
          </p>
        )}

        {recent.map((sub) => (
          <div
            key={sub.id}
            className="flex justify-between items-center bg-slate-800 p-4 rounded mt-2 hover:bg-slate-700 cursor-pointer"
            onClick={() => navigate(`/submission/${sub.id}`)}
          >
            <div>
              <div className="font-medium">
                {sub.problem?.title || "Problem"}
              </div>
              <div className="text-sm text-slate-400">
                {new Date(sub.createdAt).toLocaleString()}
              </div>
            </div>

            <VerdictBadge verdict={sub.verdict} />
          </div>
        ))}
      </div>
    </div>
  );
}