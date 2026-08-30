export default function VerdictBadge({ verdict }) {
  if (!verdict) return null;

  const colors = {
    PENDING: "var(--warning)",
    ACCEPTED: "var(--success)",
    WRONG_ANSWER: "var(--error)",
    RUNTIME_ERROR: "var(--error)",
    TIME_LIMIT_EXCEEDED: "var(--warning)",
    ERROR: "var(--error)",
  };

  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        background: colors[verdict] || "var(--muted)",
        color: "#000",
        fontWeight: 600,
        fontSize: 13,
        fontFamily: "var(--font-display)",
        letterSpacing: "0.02em",
      }}
    >
      {verdict.replace(/_/g, " ")}
    </span>
  );
}
