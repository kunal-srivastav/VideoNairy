import { Link } from 'react-router-dom'
import {AiOutlineHome, AiOutlineYoutube, MdOutlineAccountCircle, IoReorderThreeOutline, GoVideo, MdHistory, MdOutlinePlaylistPlay} from "../assets/Icons"
import { useSelector } from 'react-redux';

function Sidebar() {

  const { loggedInUser } = useSelector(state => state.users);

  return (
  <div className="bg-dark text-light d-flex flex-column" style={{ width: '250px', minHeight: '100vh', position: 'sticky', top: 0 }}>
      
      {/* Logo */}
      <div className="d-flex align-items-center px-3 py-3 border-bottom">
        <img src="/videoNairy_logo.png" width={30} alt="VideoNairy Logo" />
        <span className="ms-2 fw-bold fs-5">VideoNairy</span>
      </div>

      {/* Menu Items */}
      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <Link to="/" className="nav-link d-flex align-items-center text-light py-2 px-3 hover-bg-secondary rounded">
            <AiOutlineHome size={25} />
            <span className="ms-3">Home</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/subscription" className="nav-link d-flex align-items-center text-light py-2 px-3 hover-bg-secondary rounded">
            <AiOutlineYoutube size={25} />
            <span className="ms-3">Subscriptions</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/history" className="nav-link d-flex align-items-center text-light py-2 px-3 hover-bg-secondary rounded">
            <MdHistory size={25} />
            <span className="ms-3">History</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/playlist" className="nav-link d-flex align-items-center text-light py-2 px-3 hover-bg-secondary rounded">
            <MdOutlinePlaylistPlay size={25} />
            <span className="ms-3">Playlist</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/videos" className="nav-link d-flex align-items-center text-light py-2 px-3 hover-bg-secondary rounded">
            <GoVideo size={25} />
            <span className="ms-3">Your Videos</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link d-flex align-items-center text-light py-2 px-3 hover-bg-secondary rounded">
            <MdOutlineAccountCircle size={25} />
            <span className="ms-3">Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;