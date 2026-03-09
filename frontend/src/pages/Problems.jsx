import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, [difficulty, tag, search]);

  const fetchProblems = async () => {
    try {
      const params = new URLSearchParams();

      if (difficulty) params.append("difficulty", difficulty);
      if (tag) params.append("tag", tag);
      if (search) params.append("search", search);

      const res = await api.get(`/problems?${params.toString()}`);
      setProblems(res.data);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-6">

      <div className="max-w-5xl mx-auto">

        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8 text-center">
          Problems
        </h1>

        {/* Filters */}
        <div className="bg-slate-800 p-4 rounded-xl mb-8 flex flex-wrap gap-4 shadow-md">

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-slate-700 px-3 py-2 rounded"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="bg-slate-700 px-3 py-2 rounded"
          >
            <option value="">All Tags</option>
            <option value="Array">Array</option>
            <option value="HashMap">HashMap</option>
            <option value="Graph">Graph</option>
            <option value="BFS">BFS</option>
            <option value="Sliding Window">Sliding Window</option>
            <option value="String">String</option>
          </select>

          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-700 px-3 py-2 rounded flex-1 min-w-[200px]"
          />

        </div>

        {/* Problems List */}
        <div className="space-y-5">

          {problems.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/judge/${p.id}`)}
              className="bg-slate-800 hover:bg-slate-700 transition p-6 rounded-xl cursor-pointer shadow-md hover:shadow-lg"
            >

              {/* Title + Difficulty */}
              <div className="flex justify-between items-center">

                <h2 className="font-semibold text-xl">
                  {p.title}
                </h2>

                <span
                  className={`px-3 py-1 text-sm rounded-lg font-semibold ${
                    p.difficulty === "EASY"
                      ? "bg-green-500 text-black"
                      : p.difficulty === "MEDIUM"
                      ? "bg-yellow-400 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {p.difficulty}
                </span>

              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">

                {p.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-slate-700 rounded-full text-slate-200"
                  >
                    {tag}
                  </span>
                ))}

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}