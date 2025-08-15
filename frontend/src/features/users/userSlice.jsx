import { createSlice } from "@reduxjs/toolkit"
import { changePassword, currentUser, createAccount, loginUser, logoutUser, userProfile, refreshToken, updateAccountDetails, userWatchHistory, updateUserImage } from "./userThunks"
import { handleOnRejected, handlePending, uiState } from "../utils/extraReducers";

const userSlice = createSlice({
    name: "users",
    initialState: {
        loggedInUser: null,
        user: null,
        watchHistory: [],
        ...uiState
    },
    reducers: {
        clearMsg: (state) => {
            state.error = null;
            state.successMsg = null
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        updateToggleSubscription: (state, action) => {
            const { isSubscribed, totalSubscribers } = action.payload;
            state.user.isSubscribed = isSubscribed;
            state.user.subscribersCount = totalSubscribers;
        }
    },
    extraReducers: builder => {
        builder 
        .addCase(currentUser.pending, handlePending)      
        .addCase(currentUser.fulfilled, (state, action) => {
            state.loading = false;
            state.loggedInUser = action.payload;
        })
        .addCase(currentUser.rejected, handleOnRejected)

        //login user
        .addCase(loginUser.pending, handlePending)
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.loggedInUser = action.payload.user;
            state.successMsg = action.payload.message;
        })
        .addCase(loginUser.rejected, handleOnRejected)

        //logOut
        .addCase(logoutUser.pending, handlePending)
        .addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.loggedInUser = null;
       })
       .addCase(logoutUser.rejected, handleOnRejected)

       //Password changed
       .addCase(changePassword.pending, handlePending)
       .addCase(changePassword.fulfilled, (state, action) => {
            state.successMsg = action.payload;
            state.loading = false;
       })
        .addCase(changePassword.rejected, handleOnRejected)

       //Register user
       .addCase(createAccount.pending, handlePending)
       .addCase(createAccount.fulfilled, (state, action) => {
            state.loggedInUser = action.payload.newUser;
            state.successMsg = action.payload.message;
            state.loading = false;
       })
        .addCase(createAccount.rejected, handleOnRejected)

       //User Profile
        .addCase(userProfile.pending, handlePending)
        .addCase(userProfile.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
       })
        .addCase(userProfile.rejected, handleOnRejected)

        .addCase(updateAccountDetails.pending, handlePending)
        .addCase(updateAccountDetails.fulfilled, (state, action) => {
            state.loading = false;
            const { successMsg, updatedUser } = action.payload;
            state.user = updatedUser;
            state.loggedInUser = updatedUser;
            state.successMsg = successMsg;
        })
        .addCase(updateAccountDetails.rejected, handleOnRejected)

        .addCase(updateUserImage.pending, handlePending)
        .addCase(updateUserImage.fulfilled, (state, action) => {
            state.loading = false;
            const { successMsg, updatedUser } = action.payload;
            state.user = updatedUser;
            state.loggedInUser = updatedUser;
            state.successMsg = successMsg;
        })

        .addCase(updateUserImage.rejected, handleOnRejected)

        .addCase(userWatchHistory.pending, handlePending)
        .addCase(userWatchHistory.fulfilled, (state, action) => {
            state.watchHistory = action.payload;
            state.loading = false;
        })
        .addCase(userWatchHistory.rejected, handleOnRejected)

        .addCase(refreshToken.pending, handlePending)
        .addCase(refreshToken.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(refreshToken.rejected, handleOnRejected);
    }
});

export const { clearMsg, setError, updateToggleSubscription } = userSlice.actions;

export default userSlice.reducer;