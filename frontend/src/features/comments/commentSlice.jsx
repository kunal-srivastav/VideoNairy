import { createSlice } from "@reduxjs/toolkit";
import { addCommentInPost, addCommentOnVideo, commentsOnPost, commentsOnVideo, deleteComment, updateComment } from "./commentThunks";
import { handleOnRejected, handlePending, uiState } from "../utils/extraReducers";

const updateCommentInList = (list, updatedComment) => {
    const index = list.findIndex(c => c._id === updatedComment._id);
    if (index !== -1) {
        list[index] = updatedComment;
    }
}

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        ...uiState,
        comments: [],
        postComments: [],
        totalCommentsOnPost: 0,
        totalComments: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    },
    reducers: {
        updateCommentOnLikeState: (state, action) => {
            const { commentId, isLiked, likesCount } = action.payload;
            const commentOnVideo = state.comments.find(c => c._id === commentId);
            if(commentOnVideo) {
                commentOnVideo.isLiked = isLiked;
                commentOnVideo.likesCount = likesCount;
            } else  {
                const commentOnPost = state.postComments.find(c => c._id === commentId);
                if(commentOnPost) {
                    commentOnPost.isLiked = isLiked;
                    commentOnPost.likesCount = likesCount;
                }
            }
        },
    },
    extraReducers: builder => {
        builder
        .addCase(commentsOnVideo.pending, handlePending)
        .addCase(commentsOnVideo.fulfilled, (state, action) => {
            state.loading = false;
            const { videoComments, totalResults, page, limit, totalPages } = action.payload;
            state.comments = videoComments;
            state.totalComments = totalResults;
            state.page = page;
            state.limit = limit;
            state.totalPages = totalPages
        })
        .addCase(commentsOnVideo.rejected, handleOnRejected)

        .addCase(commentsOnPost.pending, handlePending)
        .addCase(commentsOnPost.fulfilled, (state, action) => {
            state.loading = false;
            const { postComments, totalCommentsOnPost } = action.payload;
            state.postComments = postComments;
            state.totalCommentsOnPost = totalCommentsOnPost;
        })
        .addCase(commentsOnPost.rejected, handleOnRejected)

        .addCase(addCommentOnVideo.pending, handlePending)
        .addCase(addCommentOnVideo.fulfilled, (state, action) => {
            state.loading = false;
            const { comment } = action.payload;
            state.comments = [comment, ...(state.comments || [])];
            state.totalComments += 1;
        })
        .addCase(addCommentOnVideo.rejected, handleOnRejected)

        .addCase(addCommentInPost.pending, handlePending)
        .addCase(addCommentInPost.fulfilled, (state, action) => {
            state.loading = false;
            const { comment } = action.payload;
            state.postComments = [comment, ...(state.postComments || [])];
            state.totalCommentsOnPost += 1;
        })
        .addCase(addCommentInPost.rejected, handleOnRejected)

        .addCase(updateComment.pending, handlePending)
        .addCase(updateComment.fulfilled, (state, action) => {
            state.loading = false;
            const updatedComment = action.payload.updatedComment;
            updateCommentInList(state.comments, updatedComment);
            updateCommentInList(state.postComments, updatedComment);
        })

        .addCase(updateComment.rejected, handleOnRejected)

        .addCase(deleteComment.pending, handlePending)
        .addCase(deleteComment.fulfilled, (state, action) => {
            state.loading = false;
            const { commentId } = action.payload;
            state.comments = state.comments.filter(comment => comment._id !== commentId);
            state.postComments = state.postComments.filter(comment => comment._id !== commentId);
            state.totalComments -= 1;
            state.totalCommentsOnPost -= 1;
        })
        .addCase(deleteComment.rejected, handleOnRejected)
    }
});

export const { updateCommentOnLikeState } = commentSlice.actions;

export default commentSlice.reducer;