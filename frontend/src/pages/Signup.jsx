import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");   //  redirect 
    } catch (err) {
      if (err.response?.status === 409) {
        setError("User already exists");
      } else {
        setError("Server not reachable");
      }
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
    <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl p-8">
      
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        Create Account
      </h2>
      <p className="text-slate-400 text-center mb-6">
        Start solving problems today
      </p>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition font-semibold text-white shadow-lg"
        >
          Create Account
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-sm text-center mt-4">
          {error}
        </p>
      )}

      <p className="text-slate-400 text-sm text-center mt-6">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 hover:underline">
          Login
        </a>
      </p>

    </div>
  </div>
);

}
