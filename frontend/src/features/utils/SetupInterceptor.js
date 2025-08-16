import { logoutUser, refreshToken } from "../users/userThunks.jsx";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // cookies sent automatically
});

let isRefreshing = false;
let interceptorAttached = false;
let hasRedirected = false;

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
          // If a refresh is already in progress, just reject
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await dispatch(refreshToken()).unwrap(); // server sets new cookie
          return axiosInstance(originalRequest); // retry this request
        } catch (err) {
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
