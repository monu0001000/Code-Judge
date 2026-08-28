import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import VerdictBadge from "../components/VerdictBadge";
import BarChart from "../components/charts/BarChart";
import Sparkline from "../components/charts/Sparkline";

const VERDICT_LABELS = {
  ACCEPTED: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  RUNTIME_ERROR: "Runtime Error",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  PENDING: "Pending",
};

const VERDICT_COLORS = {
  ACCEPTED: "var(--success)",
  WRONG_ANSWER: "var(--error)",
  RUNTIME_ERROR: "var(--error)",
  TIME_LIMIT_EXCEEDED: "var(--warning)",
  PENDING: "var(--muted)",
};

const DIFFICULTY_COLORS = {
  Easy: "var(--success)",
  Medium: "var(--warning)",
  Hard: "var(--error)",
};

function StatCard({ label, value, color }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--panel)", borderColor: "var(--border)" }}
    >
      <div className="text-sm mb-1" style={{ color: "var(--muted)" }}>{label}</div>
      <div
        className="text-2xl font-bold"
        style={{ color: color || "var(--text)", fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--panel)", borderColor: "var(--border)" }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [verdictBreakdown, setVerdictBreakdown] = useState(null);
  const [solvedByDifficulty, setSolvedByDifficulty] = useState(null);
  const [submissionsOverTime, setSubmissionsOverTime] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/submissions/dashboard");

        setStats(res.data.stats);
        setVerdictBreakdown(res.data.verdictBreakdown || null);
        setSolvedByDifficulty(res.data.solvedByDifficulty || null);
        setSubmissionsOverTime(res.data.submissionsOverTime || []);
        setRecent((res.data.submissions || []).slice(0, 5));
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        Loading dashboard...
      </div>
    );
  }

  const verdictChartData = verdictBreakdown
    ? Object.entries(verdictBreakdown).map(([key, value]) => ({
        label: VERDICT_LABELS[key] || key,
        value,
        color: VERDICT_COLORS[key],
      }))
    : [];

  const difficultyChartData = solvedByDifficulty
    ? [
        { label: "Easy", value: solvedByDifficulty.EASY || 0, color: DIFFICULTY_COLORS.Easy },
        { label: "Medium", value: solvedByDifficulty.MEDIUM || 0, color: DIFFICULTY_COLORS.Medium },
        { label: "Hard", value: solvedByDifficulty.HARD || 0, color: DIFFICULTY_COLORS.Hard },
      ]
    : [];

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
        Welcome back 👋
      </h1>

      {error && (
        <div
          className="rounded-lg border px-4 py-3 mb-8 text-sm"
          style={{ borderColor: "var(--warning)", color: "var(--warning)" }}
        >
          Couldn't load your latest stats — showing what's available.
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Problems Solved" value={stats?.solvedProblems ?? "-"} color="var(--success)" />
        <StatCard label="Total Submissions" value={stats?.totalSubmissions ?? "-"} />
        <StatCard label="Acceptance Rate" value={`${stats?.acceptanceRate ?? 0}%`} color="var(--accent)" />
        <StatCard
          label="Fastest Runtime"
          value={stats?.fastestRuntime != null ? `${stats.fastestRuntime} ms` : "-"}
          color="#f472b6"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-4 mb-10">
        <button
          onClick={() => navigate("/problems")}
          className="px-6 py-3 rounded-lg font-semibold transition hover:opacity-90"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Solve Problems
        </button>

        <button
          onClick={() => navigate("/leaderboard")}
          className="px-6 py-3 rounded-lg font-semibold border transition hover:border-[var(--accent)]"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        >
          Leaderboard
        </button>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Panel title="Verdict Breakdown">
          <BarChart data={verdictChartData} />
        </Panel>
        <Panel title="Solved by Difficulty">
          <BarChart data={difficultyChartData} />
        </Panel>
      </div>

      <div className="mb-10">
        <Panel title="Submissions — last 14 days">
          <Sparkline data={submissionsOverTime} />
        </Panel>
      </div>

      {/* RECENT SUBMISSIONS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>

        {recent.length === 0 && (
          <p style={{ color: "var(--muted)" }}>No submissions yet.</p>
        )}

        {recent.map((sub) => (
          <div
            key={sub.id}
            className="flex justify-between items-center rounded-lg p-4 mt-2 border cursor-pointer transition hover:border-[var(--accent)]"
            style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            onClick={() => navigate(`/submission/${sub.id}`)}
          >
            <div>
              <div className="font-medium">{sub.problem?.title || "Problem"}</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>
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
