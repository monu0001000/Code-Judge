export default function VerdictBadge({ verdict }) {
  if (!verdict) return null;

  const colors = {
    PENDING: "#facc15",
    ACCEPTED: "#22c55e",
    WRONG_ANSWER: "#ef4444",
    ERROR: "#ef4444"
  };

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        background: colors[verdict] || "#6b7280",
        color: "#000",
        fontWeight: 600,
        fontSize: 14
      }}
    >
      {verdict.replace("_", " ")}
    </span>
  );
}
