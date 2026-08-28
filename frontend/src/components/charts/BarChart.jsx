// Minimal horizontal bar chart. No chart library — a handful of SVG <rect>s
// is plenty for a handful of categories, and it keeps the dashboard bundle
// light and dependency-free.
export default function BarChart({ data, height = 28, gap = 10 }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span
            className="text-xs w-36 shrink-0 truncate"
            style={{ color: "var(--muted)" }}
            title={d.label}
          >
            {d.label}
          </span>
          <div
            className="flex-1 rounded-md overflow-hidden"
            style={{ background: "var(--border)", height }}
          >
            <div
              className="h-full rounded-md transition-all duration-500"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color || "var(--accent)",
                minWidth: d.value > 0 ? 6 : 0,
              }}
            />
          </div>
          <span
            className="text-xs w-8 text-right shrink-0 tabular-nums"
            style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
          >
            {d.value}
          </span>
        </div>
      ))}
      {data.every((d) => d.value === 0) && (
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Nothing here yet.
        </p>
      )}
    </div>
  );
}
