import { useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Subscription from './pages/Subscription';
import ChangePassword from './pages/ChangePassword';
import Channel from './pages/Channel';
import Profile from './pages/Profile';
import ProfileVideos from './pages/ProfileVideos';
import ProfilePlaylist from './pages/ProfilePlaylist';
import ProfilePosts from './pages/ProfilePosts';
import PostForm from './pages/PostForm';
import PlaylistForm from './pages/PlaylistForm';
import VideoForm from './pages/VideoForm';
import VideoDetail from './pages/VideoDetail';
import UpdateAccount from './pages/UpdateAccount';
import UpdateAccountPic from './pages/UpdateAccountPic';
import PlaylistPlayer from './pages/PlaylistPlayer';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { currentUser } from './features/users/userThunks';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector(state => state.users);

  const hideLayoutPaths = [
    "/users/login",
    "/users/register",
    "/users/change-password",
    "/users/update-details"
  ];
  const hideLayout = hideLayoutPaths.includes(location.pathname);

  useEffect(() => {
    dispatch(currentUser());
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {!hideLayout && loggedInUser && (
          <div className="col-2 col-md-1 d-none d-sm-flex flex-column px-1" style={{ fontSize: "x-small" }}>
            <Sidebar />
          </div>
        )}

        <div className={!hideLayout && loggedInUser ? "col-12 col-sm-10 col-md-11" : "col-12"}>
          {!hideLayout && <Navbar />}
          <div className="p-1 p-md-0">
            <Routes>
              <Route path='/' element={<Homepage />} />
                <Route path='/users'>
                  <Route path='subscription' element={<Subscription />} />
                  <Route path='change-password' element={<ChangePassword />} />
                  <Route path='login' element={<Login />} />
                  <Route path='register' element={<Register />} />
                  <Route path="you" element={<Channel />} />
                  <Route path="update-details" element={<UpdateAccount />} />
                  <Route path="update-avatar" element={<UpdateAccountPic name={"avatar"} />} />
                  <Route path="update-coverImage" element={<UpdateAccountPic name={"coverImage"} />} />
                  <Route path="profile/:userName" element={<Profile />}>
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
