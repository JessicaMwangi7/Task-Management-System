import axios from "axios";

// Base URL comes from Vercel env var, injected at build time
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Automatically attach token from localStorage if exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;