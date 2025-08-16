import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlineYoutube, MdOutlineAccountCircle, IoReorderThreeOutline, GoVideo, MdHistory, MdOutlinePlaylistPlay } from "../assets/Icons";
import { useSelector } from "react-redux";

function SidebarUI() {
  const { loggedInUser } = useSelector((state) => state.users);

  return (
    <>
      {/* Mobile toggle button */}
      <Link
        className="d-md-none text-decoration-none ms-3 my-3"
        data-bs-toggle="offcanvas"
        to="#offcanvasSidebar"
        role="button"
        aria-controls="offcanvasSidebar"
      >
        <IoReorderThreeOutline size={32} color="white" />
      </Link>

      {/* Offcanvas Sidebar for Mobile */}
      <div
        className="offcanvas offcanvas-start bg-dark text-light d-md-none"
        style={{ width: "250px" }}
        tabIndex="-1"
        id="offcanvasSidebar"
        aria-labelledby="offcanvasSidebarLabel"
      >
        <div className="offcanvas-header">
          <h6 className="offcanvas-title" id="offcanvasSidebarLabel">
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
            <span className="ms-2 fw-bold">VideoNairy</span>
          </h6>
        </div>
        <div className="offcanvas-body p-0">
          <ul className="nav flex-column fs-6">
            <li className="nav-item">
              <Link className="nav-link text-light py-2" to="/">
                <AiOutlineHome size={25} /> <span className="ms-2">Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light py-2" to="/users/subscription">
                <AiOutlineYoutube size={25} /> <span className="ms-2">Subscriptions</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light py-2" to="/users/you">
                <MdHistory size={25} /> <span className="ms-2">History</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-light py-2"
                to={`/users/profile/${loggedInUser?.userName}/playlists`}
              >
                <MdOutlinePlaylistPlay size={25} /> <span className="ms-2">Playlists</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-light py-2"
                to={`/users/profile/${loggedInUser?.userName}`}
              >
                <GoVideo size={25} /> <span className="ms-2">Your Videos</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="d-none d-md-flex flex-column bg-dark text-light p-2" style={{ width: "220px" }}>
        <ul className="nav flex-column fs-6">
          <li className="nav-item">
            <Link className="nav-link text-light py-2" to="/">
              <AiOutlineHome size={25} /> <span className="ms-2">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light py-2" to="/users/subscription">
              <AiOutlineYoutube size={25} /> <span className="ms-2">Subscriptions</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light py-2" to="/users/you">
              <MdHistory size={25} /> <span className="ms-2">History</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-light py-2"
              to={`/users/profile/${loggedInUser?.userName}/playlists`}
            >
              <MdOutlinePlaylistPlay size={25} /> <span className="ms-2">Playlists</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-light py-2"
              to={`/users/profile/${loggedInUser?.userName}`}
            >
              <GoVideo size={25} /> <span className="ms-2">Your Videos</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default SidebarUI;
