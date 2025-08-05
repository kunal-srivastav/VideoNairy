import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/SetupInterceptor";

export const createPost = createAsyncThunk("/posts/create", 
    async (postData, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(`/posts/create`, postData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Post cannot create");
        }
    }
);

export const updatePost = createAsyncThunk("/posts/update", 
    async ({postId, postData}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.patch(`/posts/update/${postId}`, postData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Post cannot update");
        }
    }
);

export const deletePost = createAsyncThunk("/posts/delete", 
    async (postId, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/posts/delete/${postId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Post cannot delete");
        }
    }
);