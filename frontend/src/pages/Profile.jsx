import { useEffect, useState } from "react";
import api from "../services/api";
import SubmissionModal from "../components/SubmissionModal";
import VerdictBadge from "../components/VerdictBadge";

function StatCard({ label, value }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--panel)", borderColor: "var(--border)" }}
    >
      <div className="text-sm mb-1" style={{ color: "var(--muted)" }}>{label}</div>
      <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </div>
    </div>
  );
}

export default function Profile() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/submissions/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
        setError(true);
      }
    };

    fetchDashboard();
  }, []);

  const openSubmission = async (id) => {
    try {
      const res = await api.get(`/submissions/${id}`);
      setSelectedSubmission(res.data);
    } catch (err) {
      console.error("Failed to load submission", err);
    }
  };

  if (error) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--muted)" }}
      >
        Couldn't load your profile right now.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border p-5 animate-pulse" style={{ background: "var(--panel)", borderColor: "var(--border)", height: 76 }} />
          ))}
        </div>
        <div className="rounded-xl border p-6 animate-pulse" style={{ background: "var(--panel)", borderColor: "var(--border)", height: 240 }} />
      </div>
    );
  }

  const { stats, submissions } = data;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
        Your Profile
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Problems Solved" value={stats.solvedProblems} />
        <StatCard label="Total Submissions" value={stats.totalSubmissions} />
        <StatCard label="Acceptance Rate" value={`${stats.acceptanceRate}%`} />
        <StatCard label="Fastest Runtime" value={stats.fastestRuntime != null ? `${stats.fastestRuntime} ms` : "-"} />
      </div>

      {/* SUBMISSION HISTORY */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
      >
        <h2 className="text-lg font-semibold mb-4">Submission History</h2>

        {submissions.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No submissions yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <th className="py-3 font-medium" style={{ color: "var(--muted)" }}>Problem</th>
                  <th className="font-medium" style={{ color: "var(--muted)" }}>Verdict</th>
                  <th className="font-medium" style={{ color: "var(--muted)" }}>Runtime</th>
                  <th className="font-medium" style={{ color: "var(--muted)" }}>Date</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => openSubmission(s.id)}
                    className="border-b cursor-pointer transition hover:bg-[var(--border)]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="py-3">{s.problem.title}</td>
                    <td className="py-3"><VerdictBadge verdict={s.verdict} /></td>
                    <td className="py-3" style={{ color: "var(--text)" }}>
                      {s.runtimeMs != null ? `${s.runtimeMs} ms` : "-"}
                    </td>
                    <td className="py-3" style={{ color: "var(--muted)" }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SubmissionModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  );
}
