import { logoutUser, refreshToken } from "../users/userThunks";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let refreshTokenPromise = null;

export const SetupInterceptor = (dispatch) => {
  axiosInstance.interceptors.response.use(
    res => res,
    async error => {
      const originalRequest = error.config;

      if (!error?.response) {
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // If a refresh is already happening, wait for it
        if (!refreshTokenPromise) {
          refreshTokenPromise = dispatch(refreshToken()).unwrap()
            .finally(() => {
              refreshTokenPromise = null; // Reset after it resolves/rejects
            });
        }

        try {
          await refreshTokenPromise;
          return axiosInstance(originalRequest);
        } catch (err) {
          dispatch(logoutUser());
          window.location.href = "/users/login";
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};
