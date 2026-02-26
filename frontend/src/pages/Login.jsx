import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl p-8 animate-fadeIn">

        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        <p className="text-center text-slate-400 mb-8">
          Login to continue solving problems
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-600 transition font-semibold shadow-lg"
          >
            Login
          </button>

        </form>

        {error && (
          <p className="text-red-400 text-center mt-4">{error}</p>
        )}

        <p className="text-center text-slate-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-sky-400 hover:underline">
            Sign up
          </Link>
        </p>

      </div>
     
    </div>
  );
}
