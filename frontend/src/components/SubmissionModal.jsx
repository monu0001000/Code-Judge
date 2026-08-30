import SubmissionDetails from "./SubmissionDetails";

export default function SubmissionModal({ submission, onClose }) {
  if (!submission) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(0, 0, 0, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl border w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="text-sm hover:opacity-80 transition"
            style={{ color: "var(--error)" }}
          >
            Close ✕
          </button>
        </div>

        <SubmissionDetails submission={submission} />
      </div>
    </div>
  );
}
