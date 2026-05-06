import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext.jsx";

export default function UserLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const account = await login({ email, password });
      return navigate("/user/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] animate-fade-in-up">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-24 h-24 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-8">Please enter your details to sign in.</p>
          
          <form onSubmit={onSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 backdrop-blur-sm p-4 text-sm text-red-800 shadow-sm animate-pulse">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <input 
                type="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                placeholder="name@example.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <input 
                type="password"
                required
                className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            
            <button 
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            
            <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-100">
              Don't have an account? <Link className="font-semibold text-blue-600 hover:text-indigo-600 hover:underline transition-colors" to="/user/register">Create one now</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

