import {
  TbPasswordUser, FaUserAlt, IoCreateOutline, IoIosAdd, IoIosSearch,
  IoIosLogOut, MdOutlineAccountCircle, MdOutlinePlaylistAdd, CiYoutube
} from "../assets/Icons";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../features/users/userSlice';
import { logoutUser } from '../features/users/userThunks';
import { videosFetched } from "../features/videos/videoThunks";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector(state => state.users);

  const handleOnLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (err) {
      dispatch(setError(err?.message || "Logout failed"));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(videosFetched(searchItem));
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark py-2 rounded mb-3">
      <div className="container-fluid">

        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-1">
          <img src="/videoNairy_logo.png" width={30} alt="YouTube Logo" />
          <div className="fw-bold position-relative">
            VideoNairy
            <span className="position-absolute top-0 start-100 translate-middle badge bg-secondary" style={{ fontSize: "0.6rem" }}>
              IN
            </span>
          </div>
        </Link>

        {/* Toggler */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarContent">

          {/* Search bar - center aligned */}
          <form onSubmit={handleSearch} className="d-flex mx-auto my-2 my-md-0 w-75 px-5 w-md-50" role="search">
            <input
              type="search"
              className="form-control bg-dark text-light rounded-start-pill"
              placeholder="Search..."
              onChange={(e) => setSearchItem(e.target.value)}
            />
            <button className="btn btn-secondary rounded-end-pill px-3" type="submit">
              <IoIosSearch size={20} />
            </button>
          </form>

          {/* Right-aligned section */}
          <div className="d-flex align-items-center gap-4 ms-auto mt-2 mt-md-0">

            {/* Create Dropdown */}
            {loggedInUser && (
              <div className="dropdown">
                <button className="btn btn-outline-light dropdown-toggle rounded-pill" data-bs-toggle="dropdown">
                  <IoIosAdd size={20} /> Create
                </button>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li><Link className="dropdown-item" to="/videos/upload"><CiYoutube /> Upload video</Link></li>
                  <li><Link className="dropdown-item" to="/posts/create"><IoCreateOutline /> Create post</Link></li>
                  <li><Link className="dropdown-item" to="/playlists/create"><MdOutlinePlaylistAdd /> Create playlist</Link></li>
                </ul>
              </div>
            )}

            {/* Auth/Login */}
            {!loggedInUser ? (
              <>
                <Link to="/users/login" className="btn btn-secondary">Login</Link>
                <Link to="/users/register" className="btn p-1"><MdOutlineAccountCircle size={30} color="white" /></Link>
              </>
            ) : (
              <div className="dropdown">
                <button className="btn p-0 border-0 bg-transparent" data-bs-toggle="dropdown">
                  <img src={loggedInUser.avatar || "./profilePic.jpg"} className="rounded-circle" width={35} height={35} alt="Profile" />
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                  <li><Link className="dropdown-item" to={`/users/profile/${loggedInUser.userName}`}><FaUserAlt /> Profile</Link></li>
                  <li><Link className="dropdown-item" to="/users/change-password"><TbPasswordUser /> Change Password</Link></li>
                  <li><button className="dropdown-item text-danger" onClick={handleOnLogout}><IoIosLogOut /> Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
