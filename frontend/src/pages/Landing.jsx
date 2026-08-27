import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PlaygroundDemo from "../components/PlaygroundDemo";

const CHECKS = [
  {
    test: "Can submitted code reach the filesystem or network?",
    verdict: "No.",
    detail:
      "Every submission runs inside isolated-vm — a separate V8 heap with a hard memory ceiling and a wall-clock timeout. No require, no fs, no process.",
  },
  {
    test: "Do you just get pass or fail?",
    verdict: "No.",
    detail:
      "Llama 3.3 70B, via Groq, reviews your solution for logic, edge cases, time complexity, and what you could improve.",
  },
  {
    test: "Can you track progress over time?",
    verdict: "Yes.",
    detail:
      "A dashboard tracks acceptance rate, fastest runtime, and your full submission history, so you can see the trend, not just the last result.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}
    >
      {/* NAVBAR */}
      <nav
        className="flex justify-between items-center px-6 md:px-10 py-6 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Code<span style={{ color: "var(--accent)" }}>Judge</span>
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: "var(--muted)", outlineColor: "var(--accent)" }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 rounded-lg font-medium transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: "var(--accent)", color: "#fff", outlineColor: "var(--accent)" }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20 grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs uppercase tracking-[0.2em] mb-5"
            style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}
          >
            Every submission gets a verdict
          </p>

          <h2
            className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Write code.
            <br />
            Get <span style={{ color: "var(--success)" }}>judged</span>.
          </h2>

          <p className="text-lg mb-10 max-w-md" style={{ color: "var(--muted)" }}>
            Solve real problems, run against real test cases inside an isolated
            sandbox, and get an AI review of your solution — not just a
            pass or fail.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-7 py-3.5 rounded-xl font-semibold transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: "var(--accent)", color: "#fff", outlineColor: "var(--accent)" }}
            >
              Start Solving
            </button>

            <a
              href="#verdicts"
              className="px-7 py-3.5 rounded-xl font-medium border transition hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ borderColor: "var(--border)", color: "var(--text)", outlineColor: "var(--accent)" }}
            >
              See how it's judged
            </a>
          </div>

          <p className="mt-8 text-sm" style={{ color: "var(--muted)" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Login
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center md:justify-end"
        >
          <PlaygroundDemo />
        </motion.div>
      </section>

      {/* VERDICTS / FEATURES */}
      <section id="verdicts" className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <h3
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How it's judged
        </h3>
        <p className="mb-12" style={{ color: "var(--muted)" }}>
          Three questions people usually ask about a judge platform — answered
          the same way your code gets answered.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {CHECKS.map((c, i) => (
            <div
              key={i}
              className="rounded-xl border p-6"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <p
                className="text-xs uppercase tracking-wide mb-3"
                style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}
              >
                Test — {c.test}
              </p>
              <p
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--success)", fontFamily: "var(--font-display)" }}
              >
                ✓ ACCEPTED — {c.verdict}
              </p>
              <p style={{ color: "var(--text)" }}>{c.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 text-center">
          <h3
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready for your first verdict?
          </h3>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3.5 rounded-xl font-semibold transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: "var(--accent)", color: "#fff", outlineColor: "var(--accent)" }}
          >
            Start Solving
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="text-center text-sm py-8 border-t"
        style={{ color: "var(--muted)", borderColor: "var(--border)" }}
      >
        Built with React, Node, Express, Prisma &amp; PostgreSQL — code runs in
        an isolated V8 sandbox, not exec().
      </footer>
    </div>
  );
}
