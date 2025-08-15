import { logoutUser, refreshToken } from "../users/userThunks.jsx";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // so cookies (JWT) are sent automatically
});

let interceptorAttached = false;
let isRefreshing = false;
let failedQueue = [];

// Helper to resolve/reject all queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

export const SetupInterceptor = (dispatch) => {
  if (interceptorAttached) return;
  interceptorAttached = true;

  axiosInstance.interceptors.response.use(
    res => res,
    async (error) => {
      const originalRequest = error.config;

      // If no response from server (network or CORS error)
      if (!error?.response) {
        return Promise.reject(error);
      }

      // Handle expired access token
      if (error.response.status === 401 && !originalRequest._retry) {
        // If refresh is already happening → wait in queue
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => axiosInstance(originalRequest)) // retry after refresh
            .catch(err => Promise.reject(err));
        }

        // Mark request as retried
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Refresh access token using cookie
          console.log("refresh token");
          await dispatch(refreshToken()).unwrap();

          // Retry all queued requests
          processQueue(null);
          return axiosInstance(originalRequest);
        } catch (err) {
          console.log("Refresh token error", err);
          // Fail all queued requests and logout
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
