import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-cyan-400 border-cyan-400"
      : "text-slate-300 border-transparent hover:text-white";

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-700">

        <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-5">

          {/* Logo */}
          <div
            className="text-3xl font-bold tracking-wide cursor-pointer hover:text-cyan-400 transition"
            onClick={() => navigate("/dashboard")}
          >
            CodeJudge
          </div>

          {/* Links */}
          <div className="flex items-center gap-10 text-base font-medium">

            <Link
              to="/dashboard"
              className={`pb-1 border-b-2 transition duration-200 ${isActive("/dashboard")}`}
            >
              Dashboard
            </Link>

            <Link
              to="/problems"
              className={`pb-1 border-b-2 transition duration-200 ${isActive("/problems")}`}
            >
              Problems
            </Link>

            <Link
              to="/profile"
              className={`pb-1 border-b-2 transition duration-200 ${isActive("/profile")}`}
            >
              Profile
            </Link>

          </div>

        </div>

      </nav>

      {/* PAGE CONTENT */}
      <main className="px-6 py-6">
        {children}
      </main>

    </div>
  );
}