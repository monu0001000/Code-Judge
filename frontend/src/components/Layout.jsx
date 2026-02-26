import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-cyan-400"
      : "text-slate-300 hover:text-white";

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-700 bg-slate-900">

        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          CodeJudge
        </div>

        <div className="flex gap-6 items-center">

          <Link to="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>

          <Link to="/problems" className={isActive("/problems")}>
            Problems
          </Link>

          <Link to="/profile" className={isActive("/profile")}>
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div>{children}</div>
    </div>
  );
}