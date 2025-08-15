import { logoutUser, refreshToken } from "../users/userThunks";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

let isRefreshing = false;       // To prevent multiple refresh calls
let failedQueue = [];           // Store requests while refreshing

// Retry or reject queued requests after refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

export const SetupInterceptor = (dispatch) => {
  axiosInstance.interceptors.response.use(
    (res) => res, // Pass successful responses directly
    async (error) => {
      const originalRequest = error.config;

      // No response means network or CORS issue → reject
      if (!error?.response) {
        return Promise.reject(error);
      }

      // If it's 401 and not already retried, try refresh
      if (
        error.response.status === 401 && !originalRequest._retry) {
        // If already refreshing, add to queue
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => axiosInstance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        // Mark this request as already retried
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          console.log("🔄 Refreshing token...");
          await dispatch(refreshToken()).unwrap();

          // Retry queued requests
          processQueue(null);
          return axiosInstance(originalRequest);
        } catch (err) {
          console.log("❌ Refresh token failed", err);
          processQueue(err);
          dispatch(logoutUser());
          window.location.href = "/users/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
