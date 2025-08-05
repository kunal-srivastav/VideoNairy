import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/SetupInterceptor";

export const commentsOnVideo = createAsyncThunk("/comments/video",
    async ({videoId, page, sortBy}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/comments/video/${videoId}`, {params: {page, sortBy}});
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Failed to fetch video comments");
        }
    }
);

export const commentsOnPost = createAsyncThunk("/comments/post",
    async (postId, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/comments/post/${postId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Failed to fetch post comments");
        }
    }
)

export const addCommentOnVideo = createAsyncThunk("/comments/add/video",
    async ({videoId, commentContent}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(`/comments/video/${videoId}/add-comment`, {content: commentContent});
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Failed to add comment in video");
        }
    }
);

export const addCommentInPost = createAsyncThunk("/comments/add/post",
    async ({postId, commentContent}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(`/comments/post/${postId}/add-comment`, {content: commentContent});
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Failed to add comment in post");
        }
    }
);

export const updateComment = createAsyncThunk("/comments/update",
    async ({isEditingCommentId, commentContent}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.patch(`/comments/update-comment/${isEditingCommentId}`, {content: commentContent});
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Failed to update comment");
        }
    }
)

export const deleteComment = createAsyncThunk("/comments/delete",
    async ({commentId}, {rejectWithValue}) => {
        try {
            await axiosInstance.get(`/comments/delete-comment/${commentId}`);
            return { commentId };
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Failed to delete comments");
        }
    }
)