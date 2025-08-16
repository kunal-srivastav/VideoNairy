import { logoutUser, refreshToken } from "../users/userThunks.jsx";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // cookies are sent automatically
});

let isRefreshing = false;
let failedQueue = [];
let interceptorAttached = false;
let hasRedirected = false;

const processQueue = (error) => {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
};

export const SetupInterceptor = (dispatch) => {
  if (interceptorAttached) return;
  interceptorAttached = true;

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (!error?.response) return Promise.reject(error);

      // Don't retry these URLs
      if (
        ["/users/login", "/users/register", "/users/refresh-token"].some((url) =>
          originalRequest.url?.includes(url)
        )
      ) {
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Store the request for retry
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: () => {
                originalRequest._retry = true;
                resolve(axiosInstance(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await dispatch(refreshToken()).unwrap(); // server sets new cookie

          // Retry all queued requests
          failedQueue.forEach(({ resolve }) => resolve());
          failedQueue = [];

          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err);
          if (!hasRedirected) {
            hasRedirected = true;
            dispatch(logoutUser());
            window.location.href = "/users/login";
          }
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
