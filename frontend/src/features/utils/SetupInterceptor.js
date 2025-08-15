import { logoutUser, refreshToken } from "../users/userThunks";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

let interceptorAttached = false;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

export const SetupInterceptor = (dispatch) => {
  if (interceptorAttached) return;
  interceptorAttached = true;

  axiosInstance.interceptors.response.use(
    res => res,
    async error => {
      const originalRequest = error.config;

      if (!error?.response) return Promise.reject(error);

      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
          .then(() => axiosInstance(originalRequest))
          .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            await dispatch(refreshToken()).unwrap();
            processQueue(null);
            resolve(axiosInstance(originalRequest));
          } catch (err) {
            processQueue(err);
            dispatch(logoutUser());
            window.location.href = "/users/login";
            reject(err);
          } finally {
            isRefreshing = false;
          }
        });
      }

      return Promise.reject(error);
    }
  );
};
