import { useEffect, useState } from "react";
import api from "../services/api";
import DiscussionItem from "./DiscussionItem";

export default function DiscussionList({ problemId }) {
  const [discussions, setDiscussions] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const res = await api.get(`/discussions/${problemId}`);
      setDiscussions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">

        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
          rows={3}
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={postComment}
            disabled={loading}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-semibold transition"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>

      </div>

      {/* Discussions */}
      {discussions.length === 0 && (
        <p className="text-slate-400 text-sm">
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