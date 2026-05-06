import React, { createContext, useEffect, useMemo, useState } from "react";

import { api } from "../api/client";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        if (token) {
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          const res = await api.get("/api/auth/me");
          setAccount(res.data.account);
        } else {
          setAccount(null);
        }
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setAccount(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!token) {
      delete api.defaults.headers.common.Authorization;
      return;
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, [token]);

  const value = useMemo(() => {
    return {
      token,
      account,
      loading,
      login: async ({ email, password }) => {
        const res = await api.post("/api/auth/login", { email, password });
        const nextToken = res.data.token;
        setToken(nextToken);
        localStorage.setItem("token", nextToken);
        setAccount(res.data.account);
        return res.data.account;
      },
      register: async ({ name, email, password, role, districtName, specialty, inviteCode }) => {
        const res = await api.post("/api/auth/register", { name, email, password, role, districtName, specialty, inviteCode });
        return res.data;
      },
      logout: () => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
        setToken(null);
        setAccount(null);
      }
    };
  }, [account, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

