import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext.jsx";

export default function Layout({ children }) {
  const { account, logout } = useContext(AuthContext) || {};

  return (
    <div className="relative min-h-screen font-sans bg-gray-50 overflow-hidden text-gray-800">
      {/* Background decoration */}
      <div className="absolute top-[-10rem] left-[-10rem] w-[40rem] h-[40rem] rounded-full bg-blue-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
      <div className="absolute top-[20%] right-[-15rem] w-[50rem] h-[50rem] rounded-full bg-indigo-100/40 mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[-10rem] left-[10%] w-[30rem] h-[30rem] rounded-full bg-purple-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative flex flex-col min-h-screen">
        <header className="sticky top-4 z-50 mx-4 lg:mx-auto max-w-6xl w-full rounded-2xl glass-panel px-6 py-4 flex items-center justify-between transition-all duration-300 hover:shadow-2xl">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg text-white grid place-items-center font-bold text-lg group-hover:scale-105 transition-transform duration-300">
              M
            </div>
            <div className="font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Skin Disease Mage
            </div>
          </Link>
          <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium">
            {!account ? (
              <>
                <Link className="rounded-xl px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors" to="/user/login">Log In</Link>
              </>
            ) : (
              <>
                {account.role === "user" && (
                  <Link className="rounded-xl px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors" to="/user/dashboard">Dashboard</Link>
                )}
                <button className="rounded-xl px-4 py-2.5 text-red-600 hover:bg-red-50 hover:shadow-sm transition-all" onClick={logout}>Sign Out</button>
              </>
            )}
          </nav>
        </header>

        <main className="flex-1 w-full mx-auto max-w-6xl px-4 py-12 md:py-20 z-10 animate-fade-in-up">
          {children}
        </main>

        <footer className="mt-auto py-8 text-center text-sm text-gray-400 z-10">
          <p>© {new Date().getFullYear()} Skin Disease Mage. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

