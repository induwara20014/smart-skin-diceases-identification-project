import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext.jsx";

export default function ProtectedRoute({ roles, children }) {
  const { account, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="p-6 text-gray-700">Loading...</div>;
  if (!account) return <Navigate to="/login" replace state={{ from: location }} />;

  if (roles && roles.length && !roles.includes(account.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

