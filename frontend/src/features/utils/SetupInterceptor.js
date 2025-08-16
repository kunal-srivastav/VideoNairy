import axios from "axios";
import { refreshToken, logoutUser } from "../users/userThunks.jsx";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const SetupInterceptor = (dispatch) => {
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const result = await dispatch(refreshToken());

          if (result.meta.requestStatus === "fulfilled") {
            return axiosInstance(originalRequest); // retry request
          } else {
            dispatch(logoutUser());
            window.location.href = "/users/login";
            return Promise.reject(err);
          }
        } catch (refreshErr) {
          dispatch(logoutUser());
          window.location.href = "/users/login";
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(err);
    }
  );
};
