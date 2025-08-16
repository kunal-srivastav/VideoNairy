import { createSlice } from "@reduxjs/toolkit";
import { addVideoInPlaylist, createPlaylist, deletePlaylist, playlistById, removeVideoInPlaylist, updatePlaylist } from "./playlistThunk";
import { handleOnRejected, handlePending, uiState} from "../utils/extraReducers";
import { userProfile } from "../users/userThunks";

const playlistSlice = createSlice({
    name: "playlists",
    initialState: {
        ...uiState,
        playlists: [],
        playlist: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(createPlaylist.pending, handlePending)
        .addCase(createPlaylist.fulfilled, (state, action) => {
            state.loading = false;
            state.playlists.unshift(action.payload.playListCreated)
        })
        .addCase(createPlaylist.rejected, handleOnRejected)

        .addCase(userProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.playlists = action.payload.playlists
        })

        .addCase(addVideoInPlaylist.pending, handlePending)
        .addCase(addVideoInPlaylist.fulfilled, (state, action) => {
            state.loading = false;
            const { addVideo } = action.payload;
            const playlist = state.playlists.find(p => p._id === addVideo?._id);
            if(playlist) {
            playlist.videos = addVideo.videos;
            }
        })
        .addCase(addVideoInPlaylist.rejected, handleOnRejected)

        .addCase(removeVideoInPlaylist.pending, handlePending)
        .addCase(removeVideoInPlaylist.fulfilled, (state, action) => {
            state.loading = false;
            const { removedVideo } = action.payload;
            const playlist = state.playlists.find(p => p._id === removedVideo._id);
            if(playlist){
                playlist.videos = removedVideo.videos;
            }
        })
        .addCase(removeVideoInPlaylist.rejected, handleOnRejected)

        .addCase(playlistById.pending, handlePending)
        .addCase(playlistById.fulfilled, (state, action) => {
            state.loading = false;
            state.playlist = action.payload.playlist;
        })
        .addCase(playlistById.rejected, handleOnRejected)

        .addCase(updatePlaylist.pending, handlePending)
        .addCase(updatePlaylist.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.playlists.findIndex(playlist => playlist._id === action.payload.updatedPlaylist._id);
            if(index !== -1){
                state.playlists[index] = action.payload.updatedPlaylist
            }
        })
        .addCase(updatePlaylist.rejected, handleOnRejected)

        .addCase(deletePlaylist.pending, handlePending)
        .addCase(deletePlaylist.fulfilled, (state, action) => {
            state.loading = false;            
            state.playlists = state.playlists.filter(playlist => playlist._id !== action.payload.deletedPlaylist._id)
        })
        .addCase(deletePlaylist.rejected, handleOnRejected)
    }
});

export default playlistSlice.reducer;