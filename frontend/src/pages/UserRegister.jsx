import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext.jsx";

export default function UserRegister() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setDone("");
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role: "user",
        districtName: districtName.trim()
      });
      setDone("Successfully configured profile.");
      setTimeout(() => navigate("/user/login"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please check your details.");
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] animate-fade-in-up">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-24 h-24 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Create Account</h2>
          <p className="text-sm text-gray-500 mb-8">Join the Skin Disease Mage platform.</p>
          
          <form onSubmit={onSubmit} className="space-y-5 relative z-10">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 backdrop-blur-sm p-4 text-sm text-red-800 shadow-sm animate-pulse">
                {error}
              </div>
            )}
            {done && (
              <div className="rounded-xl border border-green-200 bg-green-50/80 backdrop-blur-sm p-4 text-sm text-green-800 shadow-sm animate-pulse">
                {done} Redirecting...
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <input 
                type="text"
                required
                className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                placeholder="John Doe"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <input 
                type="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
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
                className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">District Name <span className="text-gray-400 font-normal">(Optional)</span></label>
              <select
                className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
              >
                <option value="">-- Select a District --</option>
                <option value="Ampara">Ampara</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Badulla">Badulla</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Colombo">Colombo</option>
                <option value="Galle">Galle</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Hambantota">Hambantota</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Kandy">Kandy</option>
                <option value="Kegalle">Kegalle</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Mannar">Mannar</option>
                <option value="Matale">Matale</option>
                <option value="Matara">Matara</option>
                <option value="Monaragala">Monaragala</option>
                <option value="Mullaitivu">Mullaitivu</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Puttalam">Puttalam</option>
                <option value="Ratnapura">Ratnapura</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Vavuniya">Vavuniya</option>
              </select>
            </div>

            <button 
              disabled={loading}
              className="w-full rounded-xl mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
            
            <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-100">
              Already have an account? <Link className="font-semibold text-indigo-600 hover:text-purple-600 hover:underline transition-colors" to="/user/login">Sign in here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

