import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/SetupInterceptor";

export const createPlaylist = createAsyncThunk("/playlists/create", 
    async (userPlaylist, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(`/playlists/create`, userPlaylist);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Cannot playlist create");
        }
    }
);

export const addVideoInPlaylist = createAsyncThunk("/playlists/add-video", 
    async ({playlistId, videoId}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/playlists/${playlistId}/add-video/${videoId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Cannot add video in playlist");
        }
    }
);

export const removeVideoInPlaylist = createAsyncThunk("/playlists/remove-video", 
    async ({playlistId, videoId}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/playlists/${playlistId}/remove-video/${videoId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Cannot remove video in playlist");
        }
    }
);

export const playlistById = createAsyncThunk("/playlists/playlist", 
    async (playlistId, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/playlists/${playlistId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Unable to fetch playlist");
        }
    }
);

export const updatePlaylist = createAsyncThunk("/playlists/update", 
    async ({playlistId, userPlaylist}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.patch(`/playlists/update-playlist/${playlistId}`, userPlaylist);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Cannot update playlist");
        }
    }
);

export const deletePlaylist = createAsyncThunk("/playlists/delete", 
    async (playlistId, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/playlists/delete-playlist/${playlistId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Cannot delete playlist");
        }
    }
);