import { createSlice } from "@reduxjs/toolkit";
import { deleteVideo, updateVideo, videoById, videosFetched, videoUpload } from "./videoThunks";
import { handleOnRejected, handlePending, uiState } from "../utils/extraReducers";
import { userProfile } from "../users/userThunks";

const videoSlice = createSlice({
    name: "videos",
    initialState: {
        video: null,
        videos : [],
        userVideos: [],
        totalResults: 0,
        limit: 10,
        page: 0,
        totalPages: 1,
        ...uiState
    },
    reducers: {
        updateLikeOnVideoState: (state, action) => {
            if(state.video) {
                state.video.isLiked = action.payload.isLiked;
                state.video.totalLikes = action.payload.totalLikes;
            }
        },
        updateSubscription: (state, action) => {
            if(state.video) {
                state.video.isSubscribed = action.payload.isSubscribed;
                state.video.totalSubscriber = action.payload.totalSubscribers;
            }
        }
    },
    extraReducers: builder => {
        builder
        .addCase(videosFetched.pending, handlePending)
        .addCase(videosFetched.fulfilled, (state, action) => {
            state.loading = false;
            const { totalResults, limit, page, videos, totalPages } = action.payload;
            state.videos = videos;
            state.totalResults = totalResults;
            state.limit = limit;
            state.page = page;
            state.totalPages = totalPages;
        })
        .addCase(videosFetched.rejected, (handleOnRejected))

        .addCase(userProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.userVideos = action.payload.videos;
        })

        .addCase(videoUpload.pending, handlePending)
        .addCase(videoUpload.fulfilled, (state, action) => {
            state.loading = false;
            state.videos.push(action.payload);
        })
        .addCase(videoUpload.rejected, handleOnRejected)

        // get Video by id
        .addCase(videoById.pending, handlePending)
        .addCase(videoById.fulfilled, (state, action) => {
            state.loading = false;
            state.video = action.payload;
        })
        .addCase(videoById.rejected, handleOnRejected)

        .addCase(updateVideo.pending, handlePending)
        .addCase(updateVideo.fulfilled, (state, action) => {
            state.loading = false;
            const {updatedVideo, message} = action.payload;
            const index = state.userVideos.findIndex(v => v._id === updatedVideo._id);

            if (index !== -1) {
                state.userVideos[index] = updatedVideo;
                state.successMsg = message;
            }
        })
        .addCase(updateVideo.rejected, handleOnRejected)

        //delete video
        .addCase(deleteVideo.pending, handlePending)
        .addCase(deleteVideo.fulfilled, (state, action) => {
            state.loading = false;
            const { message, deletedVideoId } = action.payload;
            state.successMsg = message;
            state.userVideos = state.userVideos.filter(v => v._id !== deletedVideoId);
        })
        .addCase(deleteVideo.rejected, handleOnRejected)
    }
});

export const { updateLikeOnVideoState, updateSubscription } = videoSlice.actions;

export default videoSlice.reducer;