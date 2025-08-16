import axios from "axios";
import { refreshToken, logoutUser } from "../users/userThunks.jsx";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // cookies sent automatically
});

export const SetupInterceptor = (dispatch) => {
  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        dispatch(logoutUser());
        window.location.href = "/users/login";
      }
      return Promise.reject(err);
    }
  );
};

