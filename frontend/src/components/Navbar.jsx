import {
  TbPasswordUser,
  FaUserAlt,
  IoCreateOutline,
  IoIosAdd,
  IoIosSearch,
  IoIosLogOut,
  MdOutlineAccountCircle,
  MdOutlinePlaylistAdd,
  CiYoutube
} from "../assets/Icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../features/users/userSlice";
import { logoutUser } from "../features/users/userThunks";
import { videosFetched } from "../features/videos/videoThunks";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.users);

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
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top py-2"
      style={{
        background: "rgba(15,15,15,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        zIndex: 1000
      }}
    >
      <div className="container-fluid px-3">
        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2 fw-bold"
        >
          <img
            src="/videoNairy_logo.png"
            alt="Logo"
            width={38}
            height={38}
            className="rounded-circle shadow-sm"
          />

          <span
            className="position-relative"
            style={{
              fontSize: "1.2rem",
              letterSpacing: "0.3px"
            }}
          >
            VideoNairy

            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary"
              style={{ fontSize: "0.55rem" }}
            >
              IN
            </span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
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
            className="d-flex mx-auto my-3 my-lg-0"
            style={{
              maxWidth: "650px",
              width: "100%"
            }}
          >
            <input
              type="search"
              className="form-control rounded-start-pill border-0 px-4"
              placeholder="Search videos..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              style={{
                backgroundColor: "#1f1f1f",
                color: "#fff",
                boxShadow: "none",
                height: "42px"
              }}
            />

            <button
              className="btn rounded-end-pill px-4"
              type="submit"
              style={{
                backgroundColor: "#272727",
                color: "#fff",
                border: "none",
                height: "42px"
              }}
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
                  className="btn rounded-pill d-flex align-items-center gap-2 px-3"
                  data-bs-toggle="dropdown"
                  style={{
                    backgroundColor: "#272727",
                    color: "#fff",
                    border: "none",
                    fontWeight: "500"
                  }}
                >
                  <IoIosAdd size={20} />
                  Create
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-dark border-0 shadow-lg"
                  style={{
                    backgroundColor: "#282828",
                    borderRadius: "14px",
                    minWidth: "230px"
                  }}
                >
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2"
                      to="/videos/upload"
                    >
                      <CiYoutube />
                      Upload Video
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2"
                      to="/posts/create"
                    >
                      <IoCreateOutline />
                      Create Post
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2"
                      to="/playlists/create"
                    >
                      <MdOutlinePlaylistAdd />
                      Create Playlist
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Auth Section */}
            {!loggedInUser ? (
              <>
                <Link
                  to="/users/login"
                  className="btn rounded-pill px-4"
                  style={{
                    backgroundColor: "#3ea6ff",
                    color: "#fff",
                    border: "none",
                    fontWeight: "600"
                  }}
                >
                  Login
                </Link>

                <Link
                  className="btn p-0 border-0"
                  to="/users/register"
                >
                  <MdOutlineAccountCircle
                    size={34}
                    color="#ffffff"
                  />
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn p-0 border-0 bg-transparent"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={loggedInUser.avatar || "./profilePic.jpg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-circle border border-2 border-secondary"
                    style={{
                      objectFit: "cover",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                  />
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-dark dropdown-menu-end border-0 shadow-lg"
                  style={{
                    backgroundColor: "#282828",
                    borderRadius: "14px",
                    minWidth: "230px"
                  }}
                >
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2"
                      to={`/users/profile/${loggedInUser.userName}`}
                    >
                      <FaUserAlt />
                      Profile
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2"
                      to="/users/change-password"
                    >
                      <TbPasswordUser />
                      Change Password
                    </Link>
                  </li>

                  <li>
                    <button
                      className="dropdown-item text-danger d-flex align-items-center gap-2"
                      onClick={handleLogout}
                    >
                      <IoIosLogOut />
                      Logout
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