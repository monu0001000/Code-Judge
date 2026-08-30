import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const DIFFICULTY_COLOR = {
  EASY: "var(--success)",
  MEDIUM: "var(--warning)",
  HARD: "var(--error)",
};

const TAGS = [
  "Array",
  "HashMap",
  "Graph",
  "BFS",
  "Sliding Window",
  "String",
  "Stack",
  "Dynamic Programming",
];

function selectClass() {
  return "px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2 transition";
}

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchProblems = async () => {
      setLoading(true);
      setError(false);
      try {
        const params = new URLSearchParams();

        if (difficulty) params.append("difficulty", difficulty);
        if (tag) params.append("tag", tag);
        if (search) params.append("search", search);

        const res = await api.get(`/problems?${params.toString()}`);
        if (!cancelled) {
          setProblems(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch problems", err);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProblems, search ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [difficulty, tag, search]);

  const solvedCount = problems.filter((p) => p.solved).length;

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Problems
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          {loading
            ? "Loading…"
            : `${problems.length} problem${problems.length === 1 ? "" : "s"}${
                solvedCount ? ` · ${solvedCount} solved` : ""
              }`}
        </p>
      </div>

      {/* FILTERS */}
      <div
        className="rounded-xl border p-4 mb-8 flex flex-wrap gap-3"
        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
      >
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className={selectClass()}
          style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={selectClass()}
          style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          <option value="">All Tags</option>
          {TAGS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search problems…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm flex-1 min-w-[200px] focus:outline-none focus-visible:ring-2"
          style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
        />
      </div>

      {/* ERROR STATE */}
      {error && (
        <div
          className="rounded-lg border px-4 py-3 mb-6 text-sm"
          style={{ borderColor: "var(--warning)", color: "var(--warning)" }}
        >
          Couldn't load problems right now. Try refreshing.
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border p-6 animate-pulse"
              style={{ background: "var(--panel)", borderColor: "var(--border)", height: 88 }}
            />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && problems.length === 0 && (
        <div
          className="rounded-xl border p-10 text-center"
          style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--muted)" }}
        >
          No problems match those filters.
        </div>
      )}

      {/* PROBLEMS LIST */}
      {!loading && !error && problems.length > 0 && (
        <div className="space-y-4">
          {problems.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/judge/${p.id}`)}
              className="rounded-xl border p-6 cursor-pointer transition hover:border-[var(--accent)]"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {p.solved && (
                    <span
                      className="shrink-0 text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ background: "rgba(74, 222, 128, 0.15)", color: "var(--success)" }}
                      title="You've solved this"
                    >
                      ✓ Solved
                    </span>
                  )}
                  <h2 className="font-semibold text-lg truncate">{p.title}</h2>
                </div>

                <span
                  className="shrink-0 px-3 py-1 text-xs rounded-lg font-semibold"
                  style={{
                    background: `color-mix(in srgb, ${DIFFICULTY_COLOR[p.difficulty]} 18%, transparent)`,
                    color: DIFFICULTY_COLOR[p.difficulty] || "var(--text)",
                  }}
                >
                  {p.difficulty}
                </span>
              </div>

              {p.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {p.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-full"
                      style={{ background: "var(--border)", color: "var(--muted)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
