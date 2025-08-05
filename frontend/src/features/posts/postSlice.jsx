import { createSlice } from "@reduxjs/toolkit";
import { createPost, deletePost, updatePost } from "./postThunks";
import { handleOnRejected, handlePending, uiState } from "../utils/extraReducers";
import { userProfile } from "../users/userThunks";

const postSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        ...uiState
    },
    reducers: {
        updateLikeOnPostState: (state, action) => {
            const { isLiked, totalLikes, postId } = action.payload;
            const post = state.posts.find(post => post._id === postId);
            if (!post) return; // safeguard if post not found

            post.isLiked = isLiked;
            post.totalLikes = totalLikes;
        },
    },
    extraReducers: builder => {
        builder
        .addCase(createPost.pending, handlePending)
        .addCase(createPost.fulfilled, (state, action) => {
            state.loading = false;
            state.posts.unshift(action.payload.createPost);
        })
        .addCase(createPost.rejected, handleOnRejected)

        .addCase(userProfile.fulfilled, (state, action) => {
            state.posts = action.payload.posts;
            state.loading = false;
        })

        .addCase(updatePost.pending, handlePending)
        .addCase(updatePost.fulfilled, (state, action) => {
            state.loading = false;
            const { updatedPost } = action.payload;
            const index = state.posts.findIndex(post => post._id === updatedPost._id);
            if(index !== -1) {
                state.posts[index] = updatedPost; 
            }
        })
        .addCase(updatePost.rejected, handleOnRejected)

        .addCase(deletePost.pending, handlePending)
        .addCase(deletePost.fulfilled, (state, action) => {
            state.loading = false;
            const { deletedPost } = action.payload;
            state.posts = state.posts.filter(post => post._id !== deletedPost._id);
        })
        .addCase(deletePost.rejected, handleOnRejected)
    }
});

export const { updateLikeOnPostState } = postSlice.actions;

export default postSlice.reducer;