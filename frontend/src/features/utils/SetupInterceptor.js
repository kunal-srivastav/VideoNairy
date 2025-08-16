import axios from "axios";
import { refreshToken, logoutUser } from "../users/userThunks.jsx";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send cookies automatically
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const SetupInterceptor = (dispatch) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // skip if already retried
      if (error.response?.status === 401 && !originalRequest._retry) {

        // Check if token is expired
        const isTokenExpired = error.response.data?.message === "Access token expired";

        if (!isTokenExpired) {
          // token is invalid or user unauthorized
          dispatch(logoutUser());
          window.location.href = "/users/login";
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const result = await dispatch(refreshToken());

          isRefreshing = false;

          if (result.meta.requestStatus === "fulfilled") {
            const newToken = result.payload.accessToken; // adjust if your payload is different
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            processQueue(null, newToken);
            return axiosInstance(originalRequest);
          } else {
            processQueue(result.error, null);
            dispatch(logoutUser());
            window.location.href = "/users/login";
            return Promise.reject(error);
          }
        } catch (refreshErr) {
          isRefreshing = false;
          processQueue(refreshErr, null);
          dispatch(logoutUser());
          window.location.href = "/users/login";
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );
};
