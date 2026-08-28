import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "border-b-2"
      : "border-b-2 border-transparent";

  const linkStyle = (path) => ({
    color: location.pathname.startsWith(path) ? "var(--accent)" : "var(--muted)",
    borderColor: location.pathname.startsWith(path) ? "var(--accent)" : "transparent",
  });

  return (
    <div className="min-h-screen app-bg" style={{ color: "var(--text)" }}>
      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 backdrop-blur border-b"
        style={{ background: "rgba(13, 11, 20, 0.9)", borderColor: "var(--border)" }}
      >
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-4">
          {/* Logo */}
          <div
            className="text-xl font-bold tracking-tight cursor-pointer transition"
            style={{ fontFamily: "var(--font-display)" }}
            onClick={() => navigate("/dashboard")}
          >
            Code<span style={{ color: "var(--accent)" }}>Judge</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 md:gap-8 text-sm md:text-base font-medium">
            <Link
              to="/dashboard"
              className={`pb-1 transition duration-200 ${isActive("/dashboard")}`}
              style={linkStyle("/dashboard")}
            >
              Dashboard
            </Link>

            <Link
              to="/problems"
              className={`pb-1 transition duration-200 ${isActive("/problems")}`}
              style={linkStyle("/problems")}
            >
              Problems
            </Link>

            <Link
              to="/leaderboard"
              className={`pb-1 transition duration-200 ${isActive("/leaderboard")}`}
              style={linkStyle("/leaderboard")}
            >
              Leaderboard
            </Link>

            <Link
              to="/profile"
              className={`pb-1 transition duration-200 ${isActive("/profile")}`}
              style={linkStyle("/profile")}
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="px-6 md:px-10 py-6">
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
