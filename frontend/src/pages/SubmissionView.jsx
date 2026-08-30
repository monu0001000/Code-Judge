import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import SubmissionDetails from "../components/SubmissionDetails";

export default function SubmissionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await api.get(`/submissions/${id}`);
        setSubmission(res.data);
      } catch (err) {
        console.error("Failed to fetch submission", err);
        setNotFound(true);
      }
    };

    fetchSubmission();
  }, [id]);

  if (notFound) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--muted)" }}
      >
        That submission couldn't be found.
      </div>
    );
  }

  if (!submission) {
    return (
      <div
        className="rounded-xl border p-6 animate-pulse"
        style={{ background: "var(--panel)", borderColor: "var(--border)", height: 240 }}
      />
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm mb-6 hover:opacity-80 transition"
        style={{ color: "var(--accent)" }}
      >
        ← Back
      </button>

      <SubmissionDetails submission={submission} />
    </div>
  );
}
