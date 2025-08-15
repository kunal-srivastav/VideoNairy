import { logoutUser, refreshToken } from "../users/userThunks";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // send cookies automatically
});

let interceptorAttached = false;

export const SetupInterceptor = (dispatch) => {
  if (interceptorAttached) return;
  interceptorAttached = true;

  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // If no server response at all (network error)
      if (!error?.response) {
        return Promise.reject(error);
      }

      // If token expired (401) and we haven't retried this request yet
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Try to refresh token (cookie-based)
          await dispatch(refreshToken()).unwrap();

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (err) {
          // If refresh failed → logout and redirect
          dispatch(logoutUser());
          window.location.href = "/users/login";
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};
