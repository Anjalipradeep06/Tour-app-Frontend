import axios from "axios";

// 1. Create axios instance //resolved
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const getStoredToken = () => {
  const directToken = localStorage.getItem("token");
  if (directToken) return directToken;

  const storedAuth = localStorage.getItem("auth");
  if (storedAuth) {
    try {
      return JSON.parse(storedAuth)?.token || null;
    } catch {
      return null;
    }
  }

  return null;
};

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR
// Handle global errors (like expired token)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token expired or invalid
    if (error.response?.status === 401) {
      console.log("Unauthorized - logging out");

      localStorage.removeItem("token");
      localStorage.removeItem("auth");

      // optional redirect to Home page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;