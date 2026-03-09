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
      className="bg-slate-800 p-4 rounded-lg"
      style={{ marginLeft: level * 20 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-sm font-bold">
          {discussion.user.name[0]}
        </div>
        <div>
          <p className="font-semibold">{discussion.user.name}</p>
          <p className="text-xs text-slate-400">
            {new Date(discussion.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="mb-3">{discussion.content}</p>

      {/* Reply Button */}
      <button
        onClick={() => setShowReply(!showReply)}
        className="text-sm text-cyan-400 hover:text-cyan-300"
      >
        Reply
      </button>

      {/* Reply Input */}
      {showReply && (
        <div className="mt-3">
          <textarea
            className="w-full bg-slate-700 p-2 rounded text-sm"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            onClick={handleReply}
            className="mt-2 px-3 py-1 bg-cyan-600 rounded text-sm"
          >
            Post Reply
          </button>
        </div>
      )}

      {/* Render Replies Recursively */}
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