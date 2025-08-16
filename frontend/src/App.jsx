import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

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

import { currentUser } from './features/users/userThunks';
import { SetupInterceptor } from './features/utils/SetupInterceptor';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector(state => state.users);
  const [userChecked, setUserChecked] = useState(false);

  const hideLayoutPaths = [
    "/users/login",
    "/users/register",
    "/users/change-password",
    "/users/update-details"
  ];
  const hideLayout = hideLayoutPaths.includes(location.pathname);

  // Attach interceptor once
  useEffect(() => {
    SetupInterceptor(dispatch);
  }, []);

  // Fetch current user once per refresh
  useEffect(() => {
    if (!userChecked) {
      dispatch(currentUser()).finally(() => setUserChecked(true));
    }
  }, [dispatch, userChecked]);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar */}
      {!hideLayout && <Navbar />}

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar */}
        {!hideLayout && loggedInUser && (
          <div className="d-none d-md-flex flex-column bg-light p-2" style={{ width: '240px' }}>
            <Sidebar />
          </div>
        )}

        {/* Main content */}
        <div className="flex-grow-1 overflow-auto p-3" style={{ minWidth: 0 }}>
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/users/login' element={<Login />} />
            <Route path='/users/register' element={<Register />} />
            <Route path='/users/subscription' element={<Subscription />} />
            <Route path='/users/change-password' element={<ChangePassword />} />
            <Route path='/users/you' element={<Channel />} />
            <Route path='/users/update-details' element={<UpdateAccount />} />
            <Route path='/users/update-avatar' element={<UpdateAccountPic name="avatar" />} />
            <Route path='/users/update-coverImage' element={<UpdateAccountPic name="coverImage" />} />
            
            <Route path='/users/profile/:userName' element={<Profile />}>
              <Route index element={<ProfileVideos />} />
              <Route path='videos' element={<ProfileVideos />} />
              <Route path='playlists' element={<ProfilePlaylist />} />
              <Route path='posts' element={<ProfilePosts />} />
            </Route>

            <Route path='/videos/video/:videoId' element={<VideoDetail />} />
            <Route path='/videos/upload' element={<VideoForm />} />
            <Route path='/videos/update-video/:videoId' element={<VideoForm />} />

            <Route path='/posts/create' element={<PostForm />} />
            <Route path='/posts/update/:postId' element={<PostForm />} />

            <Route path='/playlists/play/:playlistId' element={<PlaylistPlayer />} />
            <Route path='/playlists/create' element={<PlaylistForm />} />
            <Route path='/playlists/update-playlist/:playlistId' element={<PlaylistForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
