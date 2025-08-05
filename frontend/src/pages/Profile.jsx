import { useEffect } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { userProfile } from '../features/users/userThunks';
import { useDispatch, useSelector } from 'react-redux';
import { setError, updateToggleSubscription } from '../features/users/userSlice';
import { MdManageAccounts, MdNotificationsActive, MdModeEdit } from '../assets/Icons';
import { toggleSubscription } from '../features/subscriptions/subscriptionThunks';

function Profile() {

    const { userName } = useParams();
    const dispatch = useDispatch();
    const { user, loggedInUser } = useSelector(state => state.users);

    useEffect(() => {
      const fetchData = async () => {
          try {
            await dispatch(userProfile({userName})).unwrap();
          } catch (err) {
            dispatch(setError(err?.message || "Something went wrong"));
          }
      }
        fetchData();
    }, [userName, dispatch]);

    const handleOnToggleSubscription = async (channelId) => {
      const res = await dispatch(toggleSubscription(channelId)).unwrap();
      dispatch(updateToggleSubscription(res));
    };

  return (
    <div className="container-fluid text-dark min-vh-100">
    {/* Profile Header */}
    <div className="d-flex p-4 align-items-center position-relative mb-4" style={{ backgroundImage: `url(${user?.coverImage || "./defaultCover.jpg"})`, backgroundSize: 'cover', backgroundRepeat: "no-repeat" }} >
    {loggedInUser?._id === user?._id && (
      <Link to={"/users/update-coverImage"} ><MdModeEdit size={25} className="text-light position-absolute top-0 end-0 m-3" /></Link>
    )}
      <Link to={loggedInUser?._id === user?._id ? "/users/update-avatar" : ""}>
      <img src={user?.avatar || "./ProfilePic.jpg"} alt="Profile" className="rounded-circle" width={100} height={100} /></Link>
      <div className="ms-3">
        <h2 className="fw-bold mb-0">{user?.fullName}</h2>
        <h6 className="text-decoration-none text-dark">{user?.userName}• View channel</h6>
        <h6 className="text-decoration-none text-dark">{user?.subscribersCount} subscribers</h6>
        { loggedInUser?._id === user?._id ? (
          <Link className="btn btn-outline-secondary text-light mt-2 h-25" to={"/users/update-details"} style={{ fontSize: "small" }} >
            <MdManageAccounts size={20} /> Customized Channel
          </Link>
          ) : (
         <button className={`btn ${user?.isSubscribed ? "btn-secondary" : "btn-danger"} col-2 mt-2 h-25`} style={{ width: "150px" }} onClick={() => {handleOnToggleSubscription(user._id)}} >
            <MdNotificationsActive size={20} /> {user?.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>
    </div>

    {/* Profile Details */}
    <ul className="nav nav-underline">
        <li className="nav-item">
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "link-underline text-light active" : "text-secondary"}`} to={`/users/profile/${userName}/videos`}>Videos</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className={({isActive}) => `nav-link ${isActive? "link-underline text-light active" : "text-secondary"}`} to={`/users/profile/${userName}/playlists`}>Playlists</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className={({isActive}) => `nav-link ${isActive? "link-underline text-light active" : "text-secondary"}`} to={`/users/profile/${userName}/posts`}>Posts</NavLink>
        </li>
      </ul>

   {/* Nested Routes */}
   <Outlet />
  </div>
  )
}

export default Profile