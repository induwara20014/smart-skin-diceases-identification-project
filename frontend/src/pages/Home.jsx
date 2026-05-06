import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-4">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          AI-Powered Dermatological Analysis
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Next-Generation <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-pulse-slow">
            Skin Disease Identification
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Experience state-of-the-art AI technology to detect, analyze, and manage dermatological conditions instantly. Seamlessly integrated mapping for doctors and administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Link 
          to="/user/login" 
          className="group relative flex flex-col items-center justify-center p-8 rounded-3xl glass-card border border-white/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div className="h-14 w-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">User Login</h3>
          <p className="text-sm text-gray-500 mt-1">Log in to dashboard</p>
        </Link>

        <Link 
          to="/user/register" 
          className="group relative flex flex-col items-center justify-center p-8 rounded-3xl glass-card border border-white/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
        >
          <div className="h-14 w-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Sign Up</h3>
          <p className="text-sm text-gray-500 mt-1">Create new account</p>
        </Link>
      </div>

      <div className="mt-16 animate-fade-in-up" autoFocus style={{ animationDelay: '0.4s' }}>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Trusted by Healthcare Professionals</p>
      </div>
    </div>
  );
}

