import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/SetupInterceptor.js";

export const currentUser = createAsyncThunk("/users/current-user",
    async (_, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/users/current-user`);
            return res.data.user;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || "Failed to fetch current user");
        }
    }
);

export const loginUser = createAsyncThunk("/users/login", 
    async ({email, password}, {rejectWithValue}) => {
        try {
          const res = await axiosInstance.post(`/users/login`, {email, password});
          return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Login Failed");
        }
    }
);

export const logoutUser = createAsyncThunk("/users/logout", 
    async (_, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/users/logout`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Logout failed");
        }
    }
);

export const changePassword = createAsyncThunk("/users/change-password",
    async ({oldPassword, newPassword}, {rejectWithValue}) => {
      try {
        const res = await axiosInstance.post(`/users/change-password`, { oldPassword, newPassword });
        return res.data;
      } catch (err) {
        return rejectWithValue(err?.response?.data || "Password unchanged")
      }
    }
);

export const createAccount = createAsyncThunk("/users/register", 
    async (registerData, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(`/users/register`, registerData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Register failed");
        }
    }
);

export const userProfile = createAsyncThunk("/users/profile", 
    async ({userName, loggedInUserId}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/users/profile/${userName}`); 
            if(loggedInUserId) {
            const enrichedPosts = res?.data?.posts?.map(post => ({
            ...post,
            isLiked: post.like.includes(loggedInUserId),  // <-- this tells if user liked this post
            totalLikes: post.like.length
            }));
            return {
            ...res.data,
            posts: enrichedPosts
            };
        } else {
            return res.data;
        }
        } catch (err) {
            return rejectWithValue(err?.response?.data || "unavailable to fetch user profile");
        }
    }
);

export const updateAccountDetails = createAsyncThunk("/users/update", 
    async (updateAccountData, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.patch(`/users/update-detail`, updateAccountData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "User account detail not updated");
        }
    }
);

export const refreshToken = createAsyncThunk("/users/refresh-token", 
    async (_, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(`/users/refresh-token`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Token is not refreshed");
        }
    }
);

export const updateUserImage = createAsyncThunk("/users/update-avatar", 
    async ({type, formData}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.patch(`/users/update-image/${type}`, formData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Image is not updated");
        }
    }
);

export const userWatchHistory = createAsyncThunk("/users/history", 
    async (_, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/users/watch-history`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Unable to fetch user watch-history");
        }
    }
);