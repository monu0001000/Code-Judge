import { useState } from "react";
import api from "../services/api";

export default function DiscussionItem({ discussion, level, refresh }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    try {
      await api.post("/discussions", {
        problemId: discussion.problemId,
        content: replyText,
        parentId: discussion.id
      });

      setReplyText("");
      setShowReply(false);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="rounded-lg border p-4"
      style={{ marginLeft: level * 20, background: "var(--panel)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {discussion.user.name[0]}
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
            {discussion.user.name}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {new Date(discussion.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="mb-3 text-sm" style={{ color: "var(--text)" }}>
        {discussion.content}
      </p>

      {/* Reply Button */}
      <button
        onClick={() => setShowReply(!showReply)}
        className="text-sm font-medium hover:opacity-80 transition"
        style={{ color: "var(--accent)" }}
      >
        Reply
      </button>

      {/* Reply Input */}
      {showReply && (
        <div className="mt-3">
          <textarea
            className="w-full p-2 rounded-lg text-sm border focus:outline-none focus-visible:ring-2"
            style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            onClick={handleReply}
            className="mt-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition hover:opacity-90"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Post Reply
          </button>
        </div>
      )}

      {/* Render Replies Recursively */}
      {discussion.replies?.length > 0 && (
        <div className="mt-4 space-y-4">
          {discussion.replies.map((reply) => (
            <DiscussionItem
              key={reply.id}
              discussion={reply}
              level={level + 1}
              refresh={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
