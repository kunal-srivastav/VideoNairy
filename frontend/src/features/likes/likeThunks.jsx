import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/SetupInterceptor";

export const toggleLikeOnVideo = createAsyncThunk("/likes/video", 
    async ({videoId}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/likes/video/${videoId}`);            
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Failed toggle like on video");
        } 
    }
);

export const toggleLikeOnComment = createAsyncThunk("/likes/comment", 
    async ({commentId}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/likes/comment/${commentId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Failed toggle like on comment");
        } 
    }
);

export const toggleLikeOnPost = createAsyncThunk("/likes/post", 
    async (postId, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/likes/post/${postId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Failed toggle like on post");
        } 
    }
);

export const likedVideos = createAsyncThunk("/likes/videos", 
    async (_, {rejectWithValue}) => {
        try {
           const res = await axiosInstance.get(`/likes/videos`);
           return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Failed to fetch like video");
        } 
    }
);