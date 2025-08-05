import { createSlice } from "@reduxjs/toolkit";
import { subscribedChannels, toggleSubscription } from "./subscriptionThunks";
import { handleOnRejected, handlePending, uiState } from "../utils/extraReducers";

const subscriptionSlice = createSlice({
    name: "subscribes",
    initialState: {
        subscriptions: [],
        subscribedChannel: null,
        ...uiState
    },
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(subscribedChannels.pending, handlePending)
        .addCase(subscribedChannels.fulfilled, (state, action) => {
            state.loading = false;
            state.subscriptions = action.payload;
        })
        .addCase(subscribedChannels.rejected, handleOnRejected)

        .addCase(toggleSubscription.pending, handlePending)
        .addCase(toggleSubscription.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            const { channelId, isSubscribed, totalSubscribers } = action.payload;
            const channel = state.subscriptions.find(sub => sub.channel._id === channelId);
            if (channel) {
                channel.channel.isSubscribed = isSubscribed;
                channel.channel.subscriberCount = totalSubscribers;
            }
        })
        .addCase(toggleSubscription.rejected, handleOnRejected)

    }
});

export default subscriptionSlice.reducer;