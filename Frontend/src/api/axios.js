import axios from "axios";

const API = axios.create({
  baseURL: "https://hishabio-backend.onrender.com/api/v1",
});

// Request Interceptor
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
  (error) => Promise.reject(error),
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hishabio-token");
      localStorage.removeItem("hishabio-user");
      localStorage.removeItem("hishabio-household-id");

      sessionStorage.removeItem("hishabio-token");
      sessionStorage.removeItem("hishabio-user");
      sessionStorage.removeItem("hishabio-household-id");
    }

    return Promise.reject(error);
  },
);

export default API;
