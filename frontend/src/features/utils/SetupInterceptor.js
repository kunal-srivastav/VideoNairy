import { logoutUser, refreshToken } from "../users/userThunks.jsx";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send cookies automatically
});

let interceptorAttached = false;
let isRefreshing = false;
let failedQueue = [];

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
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      // If no server response
      if (!error?.response) {
        return Promise.reject(error);
      }

      // 🚫 Skip certain URLs from triggering refresh
      const skipUrls = [
        "/users/login",
        "/users/register",
        "/users/refresh-token"
      ];
      if (skipUrls.some(url => originalRequest.url.includes(url))) {
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized and retry logic
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Wait for refresh to finish, then retry
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => axiosInstance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          console.log("🔄 Refreshing token...");
          await dispatch(refreshToken()).unwrap();
          processQueue(null);
          return axiosInstance(originalRequest);
        } catch (err) {
          console.log("❌ Refresh token failed:", err);
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
