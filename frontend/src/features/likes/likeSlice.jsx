import { createSlice } from "@reduxjs/toolkit";
import { likedVideos, toggleLikeOnComment, toggleLikeOnPost, toggleLikeOnVideo } from "./likeThunks";
import { handleOnRejected, handlePending, uiState } from "../utils/extraReducers";

const likeSlice = createSlice({
    name: "likes",
    initialState: {
        allLikedVideos: [],
        ...uiState
    },
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(toggleLikeOnVideo.pending, handlePending)
        .addCase(toggleLikeOnVideo.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(toggleLikeOnVideo.rejected, handleOnRejected)

        // Toggle Comment
        .addCase(toggleLikeOnComment.pending, handlePending)
        .addCase(toggleLikeOnComment.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(toggleLikeOnComment.rejected, handleOnRejected)

        .addCase(toggleLikeOnPost.pending, handlePending)
        .addCase(toggleLikeOnPost.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(toggleLikeOnPost.rejected, handleOnRejected)

        .addCase(likedVideos.pending, handlePending)
        .addCase(likedVideos.fulfilled, (state, action) => {
            state.loading = false;
            state.allLikedVideos = action.payload.likedVideo;
        })
        .addCase(likedVideos.rejected, handleOnRejected)
    }
});

export default likeSlice.reducer;