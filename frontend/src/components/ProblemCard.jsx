export default function ProblemCard({ problem, onSelect }) {
  return (
    <div
      onClick={() => onSelect(problem)}
      style={{
        background: "var(--panel)",
        border: "1px solid var(--border)",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        cursor: "pointer",
        transition: "transform 0.1s ease, border 0.1s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.border = "1px solid var(--accent)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.border = "1px solid var(--border)")
      }
    >
      <h3 style={{ marginBottom: 6 }}>{problem.title}</h3>
      <span style={{ color: "var(--muted)", fontSize: 14 }}>
        Difficulty: {problem.difficulty}
      </span>
    </div>
  );
}
