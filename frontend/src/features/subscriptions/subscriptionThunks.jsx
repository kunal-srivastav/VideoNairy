import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/SetupInterceptor";

export const subscribedChannels = createAsyncThunk("/subscriptions/subscription", 
    async (_, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/subscriptions/subscribed-channel`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Cannot fetched Subscribed channel");
        }
    }
);

export const toggleSubscription = createAsyncThunk("/subscriptions/toggle",
    async (channelId, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.post(`/subscriptions/toggle/${channelId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Unable to toggle channel");
        }
    }
);