import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser]   = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Whenever token changes, configure axios and guard against a missing user
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }

    if (token && !user) {
      logout();
    }
  }, [token, user]);

  // LOGIN: store token & user, configure axios, but DON'T navigate here
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    // 1) persist into state + localStorage
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // 2) configure axios immediately
    api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;

    // return the user so callers can navigate AFTER our header is set
    return data.user;
  };

  // SIGNUP: create the user (backend returns only { message })
  const signup = async (first_name, last_name, email, password) => {
    await api.post("/auth/signup", { first_name, last_name, email, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/home");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
