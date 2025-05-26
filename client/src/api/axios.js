// client/src/api/axios.js
import axios from "axios";

// Determine base URL in order:
// 1) VITE_API_BASE_URL (preferred)
// 2) VITE_API_URL (legacy)
// 3) relative `/api` for same-origin proxying
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "/api";

const API = axios.create({
  baseURL,
});

// Automatically attach token from localStorage if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
