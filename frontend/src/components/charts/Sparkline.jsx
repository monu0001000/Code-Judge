// Minimal sparkline-style area chart, plain SVG. `data` is an array of
// { date, count } in chronological order.
export default function Sparkline({ data, width = 560, height = 90 }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const padX = 4;
  const padY = 8;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((d, i) => {
    const x = padX + (i / Math.max(1, data.length - 1)) * innerW;
    const y = padY + innerH - (d.count / max) * innerH;
    return [x, y];
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath =
    `M${points[0][0]},${height - padY} ` +
    points.map(([x, y]) => `L${x},${y}`).join(" ") +
    ` L${points[points.length - 1][0]},${height - padY} Z`;

  const hasActivity = data.some((d) => d.count > 0);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
        <path d={areaPath} fill="var(--accent)" opacity="0.12" />
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" />
        {points.map(([x, y], i) =>
          data[i].count > 0 ? (
            <circle key={i} cx={x} cy={y} r="2.5" fill="var(--accent)" />
          ) : null
        )}
      </svg>
      <div className="flex justify-between text-[11px] mt-1" style={{ color: "var(--muted)" }}>
        <span>{formatShort(data[0]?.date)}</span>
        <span>{formatShort(data[data.length - 1]?.date)}</span>
      </div>
      {!hasActivity && (
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
          No submissions in the last 14 days.
        </p>
      )}
    </div>
  );
}

function formatShort(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
