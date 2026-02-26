import { useEffect, useState } from "react";
import api from "../services/api";
import SubmissionModal from "../components/SubmissionModal";

export default function Profile() {
  const [data, setData] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/submissions/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
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

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  const { stats, submissions } = data;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard title="Problems Solved" value={stats.solvedProblems} />
        <StatCard title="Total Submissions" value={stats.totalSubmissions} />
        <StatCard title="Acceptance Rate" value={`${stats.acceptanceRate}%`} />
        <StatCard
          title="Fastest Runtime"
          value={stats.fastestRuntime || "-"}
        />
      </div>

      {/* Submission History */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Submission History</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-3">Problem</th>
              <th>Verdict</th>
              <th>Runtime</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((s) => (
              <tr
                key={s.id}
                onClick={() => openSubmission(s.id)}
                className="border-b border-slate-700 hover:bg-slate-700 cursor-pointer transition"
              >
                <td className="py-3">{s.problem.title}</td>

                <td
                  className={
                    s.verdict === "ACCEPTED"
                      ? "text-green-400 font-semibold"
                      : "text-red-400 font-semibold"
                  }
                >
                  {s.verdict}
                </td>

                <td>{s.runtimeMs || "-"}</td>

                <td>
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submission Modal */}
      <SubmissionModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
      <h3 className="text-slate-400 text-sm mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}