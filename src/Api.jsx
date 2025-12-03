import axios from "axios";

// Create Axios Base API
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Laravel API URL
});

//  Automatically attach token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  Auto logout when token expires / 401 unauthorized
// must pass logout function from AuthContext when calling
export const attachInterceptor = (logout) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Session expired or invalid → frontend logout
        console.log("401 Unauthorized → Logging out");
        logout();
      }
      return Promise.reject(error);
    }
  );
};

export default api;
