import axios from "axios";
import { refreshToken, logoutUser } from "../users/userThunks.jsx";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // cookies sent automatically
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

export const SetupInterceptor = (dispatch) => {
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      // skip if already retried
      if (err.response?.status === 401 && !originalRequest._retry) {

        // don't try to refresh while already refreshing
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => axiosInstance(originalRequest))
            .catch((error) => Promise.reject(error));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const result = await dispatch(refreshToken());

          isRefreshing = false;

          if (result.meta.requestStatus === "fulfilled") {
            processQueue(null); // retry all queued requests
            return axiosInstance(originalRequest);
          } else {
            processQueue(result.error);
            dispatch(logoutUser());
            window.location.href = "/users/login";
            return Promise.reject(err);
          }
        } catch (refreshErr) {
          isRefreshing = false;
          processQueue(refreshErr);
          dispatch(logoutUser());
          window.location.href = "/users/login";
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(err);
    }
  );
};
