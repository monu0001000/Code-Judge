import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">

      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center px-8 py-6"
      >
        <h1 className="text-2xl font-bold">
          Code<span className="text-blue-500">Judge</span>
        </h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-slate-300 hover:text-white transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </motion.nav>

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-32">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold mb-6 leading-tight"
        >
          Practice Coding <br />
          <span className="text-blue-500">Like a Pro</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-slate-400 max-w-2xl text-lg mb-10"
        >
          Solve real programming problems, run real test cases,
          and get instant verdicts.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onClick={() => navigate("/signup")}
          className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-semibold text-lg shadow-lg"
        >
          Start Solving
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 text-slate-400"
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </motion.p>
      </div>

      {/* FOOTER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 w-full text-center text-slate-500 text-sm"
      >
        Built with React, Node, Prisma & PostgreSQL
      </motion.div>

    </div>
  );
}
