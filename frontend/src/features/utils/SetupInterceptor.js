import axios from "axios";
import { refreshToken, logoutUser } from "../users/userThunks.jsx";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let interceptorSetup = false;

export const SetupInterceptor = (dispatch) => {
  if (interceptorSetup) return; // already setup
  interceptorSetup = true;

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url.includes("/users/refresh-token")) {
          dispatch(logoutUser());
          window.location.href = "/users/login";
          return Promise.reject(err);
        }

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
            processQueue(null);
            return axiosInstance(originalRequest);
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
