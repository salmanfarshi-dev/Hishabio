
import axios from "axios";

// ====================
// Axios Instance
// ====================

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

// ====================
// Request Interceptor
// ====================

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("hishabio-token") ||
      sessionStorage.getItem("hishabio-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
