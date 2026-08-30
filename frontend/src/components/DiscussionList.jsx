import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import DiscussionItem from "./DiscussionItem";

export default function DiscussionList({ problemId }) {
  const [discussions, setDiscussions] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDiscussions = useCallback(async () => {
    try {
      const res = await api.get(`/discussions/${problemId}`);
      setDiscussions(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [problemId]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const postComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);

      await api.post("/discussions", {
        problemId,
        content: newComment
      });

      setNewComment("");
      fetchDiscussions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Comment Input */}
      <div
        className="rounded-lg border p-4"
        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
      >
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 rounded-lg text-sm resize-none border focus:outline-none focus-visible:ring-2"
          style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
          rows={3}
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={postComment}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>

      {/* Discussions */}
      {discussions.length === 0 && (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          No discussions yet. Start the conversation!
        </p>
      )}

      {discussions.map((discussion) => (
        <DiscussionItem
          key={discussion.id}
          discussion={discussion}
          level={0}
          refresh={fetchDiscussions}
        />
      ))}
    </div>
  );
}
