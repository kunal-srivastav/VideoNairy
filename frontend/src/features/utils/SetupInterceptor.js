import axios from "axios";
import { refreshToken, logoutUser } from "../users/userThunks.jsx";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const SetupInterceptor = (dispatch) => {
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        // Prevent retry loops
        if (originalRequest.url.includes("/auth/refresh-token")) {
          dispatch(logoutUser());
          window.location.href = "/users/login";
          return Promise.reject(err);
        }

        if (isRefreshing) {
          // Queue the request until refresh finishes
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
            return axiosInstance(originalRequest); // retry original
          } else {
            processQueue(result.error, null);
            dispatch(logoutUser());
            window.location.href = "/users/login";
            return Promise.reject(err);
          }
        } catch (refreshErr) {
          isRefreshing = false;
          processQueue(refreshErr, null);
          dispatch(logoutUser());
          window.location.href = "/users/login";
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(err);
    }
  );
};
