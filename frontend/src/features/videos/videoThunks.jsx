import { createAsyncThunk  } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/SetupInterceptor";

export const videosFetched = createAsyncThunk("/videos", 
    async ({searchItem, page, sortBy, sortType}, {rejectWithValue}) => {
        try {
            let res;
            searchItem = searchItem?.trim();
            if(searchItem) {
                res = await axiosInstance.get(`/videos/getAllVideos?query=${searchItem}&page=${page}&sortBy=${sortBy}&sortType=${sortType}`);
            } else {
                res = await axiosInstance.get(`/videos/getAllVideos?page=${page}&sortBy=${sortBy}&sortType=${sortType}`);
            }
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Videos not fetched");
        }
    }
);

export const videoUpload = createAsyncThunk("/video/upload", 
    async (videoData, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(`/videos/upload`, videoData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Video upload failed");
        }
    }
);

export const videoById = createAsyncThunk("/video/:videoId", 
    async (videoId, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/videos/video/${videoId}`); 
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Video not fetched");
        }
    }
);

export const updateVideo = createAsyncThunk("/video/update", 
    async ({videoData, videoId}, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.patch(`/videos/update-video/${videoId}`, videoData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Video upload failed");
        }
    }
);

export const deleteVideo = createAsyncThunk("/video/delete", 
    async (videoId, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/videos/delete-video/${videoId}`)
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Video not deleted");
        }
    }
);