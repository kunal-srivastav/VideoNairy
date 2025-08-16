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

  const handleLogout = async () => {
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
    <nav className="navbar navbar-expand-lg bg-dark sticky-top shadow-sm py-2">
      <div className="container-fluid">

        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img src="/videoNairy_logo.png" alt="Logo" width={30} />
          <span className="fw-bold position-relative">
            VideoNairy
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary"
              style={{ fontSize: "0.6rem" }}
            >
              IN
            </span>
          </span>
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="d-flex mx-auto my-2 my-lg-0 w-100 w-md-50"
          >
            <input
              type="search"
              className="form-control rounded-start-pill bg-dark text-light border-secondary"
              placeholder="Search videos..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
            <button
              className="btn btn-secondary rounded-end-pill px-3"
              type="submit"
            >
              <IoIosSearch size={20} />
            </button>
          </form>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3 ms-auto">

            {/* Create Dropdown */}
            {loggedInUser && (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light rounded-pill d-flex align-items-center gap-1"
                  data-bs-toggle="dropdown"
                >
                  <IoIosAdd size={20} /> Create
                </button>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/videos/upload">
                      <CiYoutube /> Upload Video
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/posts/create">
                      <IoCreateOutline /> Create Post
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/playlists/create">
                      <MdOutlinePlaylistAdd /> Create Playlist
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Auth Buttons */}
            {!loggedInUser ? (
              <>
                <Link className="btn btn-secondary" to="/users/login">
                  Login
                </Link>
                <Link className="btn p-1" to="/users/register">
                  <MdOutlineAccountCircle size={30} color="white" />
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button className="btn p-0 border-0 bg-transparent" data-bs-toggle="dropdown">
                  <img
                    src={loggedInUser.avatar || "./profilePic.jpg"}
                    alt="Profile"
                    className="rounded-circle"
                    width={35}
                    height={35}
                  />
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to={`/users/profile/${loggedInUser.userName}`}>
                      <FaUserAlt /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/users/change-password">
                      <TbPasswordUser /> Change Password
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                      <IoIosLogOut /> Logout
                    </button>
                  </li>
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
