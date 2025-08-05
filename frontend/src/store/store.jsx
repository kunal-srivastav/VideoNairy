import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/users/userSlice";
import videoReducer from "../features/videos/videoSilce";
import commentReducer from "../features/comments/commentSlice";
import likeReducer from "../features/likes/likeSlice";
import subscriptionReducer from "../features/subscriptions/subscriptionSlice";
import playlistReducer from "../features/playlists/playlistSlice"
import postReducer from "../features/posts/postSlice"

export default configureStore({
  reducer: {
    users: userReducer,
    videos: videoReducer,
    comments: commentReducer,
    likes: likeReducer,
    subscriptions: subscriptionReducer,
    playlists: playlistReducer,
    posts: postReducer,
  },
})