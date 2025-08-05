import { logoutUser, refreshToken } from "../users/userThunks";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Replace with your API
  withCredentials: true, // Optional: if you're using cookies
});

export const SetupInterceptor = (dispatch) => {
  axiosInstance.interceptors.response.use(
    res => {
      return res;
    },
    async error => {
      const originalRequest = error.config;

      if (!error?.response) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
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
  )
}