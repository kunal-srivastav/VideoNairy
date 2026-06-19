import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlineYoutube, MdOutlineAccountCircle, IoReorderThreeOutline, GoVideo,
  MdHistory, MdOutlinePlaylistPlay } from "../assets/Icons";
import { useSelector } from "react-redux";

function Sidebar() {
  const { loggedInUser } = useSelector((state) => state.users);

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="btn border-0 bg-transparent ms-3 mt-2" data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu" >
        <IoReorderThreeOutline size={32} color="white" />
      </button>

      {/* Mobile Sidebar */}
      <div className="offcanvas offcanvas-start text-light" tabIndex="-1" id="sidebarMenu"
        style={{
          width: "280px",
          backgroundColor: "#0f0f0f",
        }}
      >
        <div className="offcanvas-header border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <img src="/videoNairy_logo.png" alt="logo" width={35} className="me-2" />

            <h5 className="mb-0 fw-bold">
              VideoNairy
              <small className="text-secondary ms-1" style={{ fontSize: "10px" }} >
                IN
              </small>
            </h5>
          </div>

          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" />
        </div>

        <div className="offcanvas-body">
          <ul className="nav flex-column gap-2">
            <SidebarLink to="/" icon={<AiOutlineHome size={24} />} text="Home" />

            <SidebarLink to="/users/subscription" icon={<AiOutlineYoutube size={24} />} text="Subscriptions" />

            <SidebarLink to="/users/you" icon={<MdHistory size={24} />} text="History" />

            <SidebarLink to={`/users/profile/${loggedInUser?.userName}/playlists`}
              icon={<MdOutlinePlaylistPlay size={24} />} text="Playlists" />

            <SidebarLink to={`/users/profile/${loggedInUser?.userName}`} icon={<GoVideo size={24} />}
              text="Your Videos" />
          </ul>
        </div>
      </div>

      {/* Desktop Mini Sidebar */}
      <aside className="d-none d-md-flex flex-column align-items-center pt-3"
        style={{
          width: "90px",
          minHeight: "100vh",
          backgroundColor: "#0f0f0f",
          borderRight: "1px solid #272727",
          position: "sticky",
          top: 0,
        }}
      >
        <DesktopLink to="/" icon={<AiOutlineHome size={28} />} text="Home" />

        <DesktopLink to="/users/subscription" icon={<AiOutlineYoutube size={28} />} text="Subs" />

        <DesktopLink to="/users/you" icon={<MdOutlineAccountCircle size={28} />} text="You" />
      </aside>
    </>
  );
}

/* Desktop Sidebar Item */
function DesktopLink({ to, icon, text }) {
  return (
    <Link to={to}
      className="text-decoration-none text-light d-flex flex-column align-items-center mb-4 p-2 rounded-3"
      style={{
        width: "75px",
        transition: "0.3s",
      }} >
      {icon}
      <small className="mt-2">{text}</small>
    </Link>
  );
}

/* Mobile Sidebar Item */
function SidebarLink({ to, icon, text }) {
  return (
    <li>
      <Link to={to} className="nav-link text-light d-flex align-items-center rounded-3 px-3 py-2"
        style={{
          transition: "0.3s",
        }} >
        {icon}
        <span className="ms-3">{text}</span>
      </Link>
    </li>
  );
}

export default Sidebar;