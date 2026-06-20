import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import Subscription from "./pages/Subscription";
import ChangePassword from "./pages/ChangePassword";
import Channel from "./pages/Channel";
import Profile from "./pages/Profile";
import ProfileVideos from "./pages/ProfileVideos";
import ProfilePlaylist from "./pages/ProfilePlaylist";
import ProfilePosts from "./pages/ProfilePosts";
import PostForm from "./pages/PostForm";
import PlaylistForm from "./pages/PlaylistForm";
import VideoForm from "./pages/VideoForm";
import VideoDetail from "./pages/VideoDetail";
import UpdateAccount from "./pages/UpdateAccount";
import UpdateAccountPic from "./pages/UpdateAccountPic";
import PlaylistPlayer from "./pages/PlaylistPlayer";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import "./App.css";

import { currentUser } from "./features/users/userThunks";
import { SetupInterceptor } from "./features/utils/SetupInterceptor";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.users);

  const [userChecked, setUserChecked] = useState(false);

  const hideLayoutPaths = [
    "/users/login",
    "/users/register",
    "/users/change-password",
    "/users/update-details",
  ];

  const hideLayout = hideLayoutPaths.includes(location.pathname);

  useEffect(() => {
    SetupInterceptor(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (!userChecked) {
      dispatch(currentUser()).finally(() => setUserChecked(true));
    }
  }, [dispatch, userChecked]);

  return (
    <div className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        color: "#ffffff",
      }}
    >
      <div className="row g-0">
        {/* Sidebar */}
        {!hideLayout && loggedInUser && (
          <div className="col-auto d-none d-sm-flex flex-column"
            style={{
              width: "80px",
              backgroundColor: "#111111",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              minHeight: "100vh",
              position: "sticky",
              top: 0,
              zIndex: 2000,
            }}
          >
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className={!hideLayout && loggedInUser ? "col" : "col-12"}
          style={{
            minHeight: "100vh",
            backgroundColor: "#0f0f0f",
          }}
        >
          {!hideLayout && <Navbar />}

          <div className="px-2 px-md-3 py-2"
            style={{
              maxWidth: "1800px",
              margin: "0 auto",
            }}
          >
            <Routes>
              <Route path="/" element={<Homepage />} />

              <Route path="/users">
                <Route path="subscription" element={<Subscription />} />

                <Route path="change-password" element={<ChangePassword />} />

                <Route path="login" element={<Login />} />

                <Route path="register" element={<Register />} />

                <Route path="you" element={<Channel />} />

                <Route path="update-details" element={<UpdateAccount />} />

                <Route path="update-avatar" element={<UpdateAccountPic name={"avatar"} />} />

                <Route path="update-coverImage" element={<UpdateAccountPic name={"coverImage"} />} />

                <Route path="profile/:userName" element={<Profile />} >
                  <Route index element={<ProfileVideos />} />

                  <Route path="videos" element={<ProfileVideos />} />

                  <Route path="playlists" element={<ProfilePlaylist />} />

                  <Route path="posts" element={<ProfilePosts />} />
                </Route>
              </Route>

              <Route path="/videos">
                <Route path="video/:videoId" element={<VideoDetail />} />

                <Route path="upload" element={<VideoForm />} />

                <Route path="update-video/:videoId" element={<VideoForm />} />
              </Route>

              <Route path="/posts">
                <Route path="create" element={<PostForm />} />

                <Route path="update/:postId" element={<PostForm />} />
              </Route>

              <Route path="/playlists">
                <Route path="play/:playlistId" element={<PlaylistPlayer />} />

                <Route path="create" element={<PlaylistForm />} />

                <Route path="update-playlist/:playlistId" element={<PlaylistForm />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;