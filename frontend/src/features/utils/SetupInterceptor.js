import { logoutUser, refreshToken } from "../users/userThunks";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

let interceptorAttached = false;

export const SetupInterceptor = (dispatch) => {
  if (interceptorAttached) return;
  interceptorAttached = true;

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (!error?.response) return Promise.reject(error);

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await dispatch(refreshToken()).unwrap();
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
