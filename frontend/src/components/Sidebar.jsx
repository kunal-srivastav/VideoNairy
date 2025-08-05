import { Link } from 'react-router-dom'
import {AiOutlineHome, AiOutlineYoutube, MdOutlineAccountCircle, IoReorderThreeOutline, GoVideo, MdHistory, MdOutlinePlaylistPlay} from "../assets/Icons"
import { useSelector } from 'react-redux';

function Sidebar() {

  const { loggedInUser } = useSelector(state => state.users);

  return (
    <>
    <Link className="text-decoration-none ms-4 ps-1 my-4" data-bs-toggle="offcanvas" to={"#offcanvasExample"} role="button" aria-controls="offcanvasExample">
      <IoReorderThreeOutline size={32} color='white' />
    </Link>

  <div className="offcanvas offcanvas-start bg-dark text-light" style={{"width": "250px"}} tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
    <div className="offcanvas-header">
      <h6 className="offcanvas-title d-flex" id="offcanvasExampleLabel"> 
      <button type="button" className="btn p-0 mt-0" data-bs-dismiss="offcanvas" aria-label="Close">
        <IoReorderThreeOutline size={30} color='white' />
      </button>
        <div className="ms-4 fw-bold">
        <img src="./videoNairy_logo.png" width={30} alt="YouTube Logo" />
        VideoNairy
        <span className="position-relative pb-2 translate-middle badge text-secondary" style={{"fontSize": "x-small"}}>
          IN
        </span>
        </div>
      </h6>
    </div>
  <div className="offcanvas-body p-0">
    <ul className='nav flex-column text-light fs-6'>
      <li className='nav-item'> <Link className='nav-link mt-3 pb-0' to={"/"} ><AiOutlineHome size={25} color='white' /> <span className='ms-3 fs-6 text-light'> Home </span> </Link></li>
      <hr />
      <li> <Link  className='nav-link py-0' to={"/users/subscription"}><AiOutlineYoutube size={25} color='white' />  <span className='ms-3 text-light'> Subscription </span> </Link> </li>
      <hr />
      <li> <Link  className='nav-link py-0' to={"/users/you"}><MdHistory size={25} color='white' />  <span className='ms-3 text-light'> History </span> </Link></li>
      <hr />
      <li> <Link  className='nav-link py-0' to={`/users/profile/${loggedInUser?.userName}/playlists`}><MdOutlinePlaylistPlay size={25} color='white' />  <span className='ms-3 text-light'> Playlist </span> </Link></li>
      <hr />
      <li> <Link  className='nav-link py-0' to={`/users/profile/${loggedInUser?.userName}`}><GoVideo size={25} color='white' /> <span className='ms-3 text-light'> Your videos </span> </Link></li>
    </ul>
  </div>
  </div>

    <ul className="nav flex-column px-3" >
      <li className="nav-item">
        <Link to={"/"} className="nav-link my-3 active rounded-0" aria-current="page" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Home" data-bs-original-title="Home">
        <AiOutlineHome color='white' size={27}  />
        <br />
        <small className='text-light'>Home</small>
        </Link>
      </li>
      <li>
        <Link to={"/users/subscription"} className="nav-link p-0 mb-3 rounded-0" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Orders" data-bs-original-title="Orders">
        <AiOutlineYoutube  color='white' className='ms-3' size={27} />
        <br />
        <small className='text-light ms-1'>Subscriptions</small>
        </Link>
      </li>
      <li>
        <Link to={"/users/you"} className="nav-link rounded-0" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Products" data-bs-original-title="Products">
        <MdOutlineAccountCircle color='white' size={27} />
        <br />
        <small className='text-light ms-1'>You</small>
        </Link>
      </li>
    </ul>
    </>
  )
}

export default Sidebar;