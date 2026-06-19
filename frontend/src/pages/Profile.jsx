import { useEffect } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { userProfile } from "../features/users/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { setError, updateToggleSubscription} from "../features/users/userSlice";
import { MdManageAccounts, MdNotificationsActive, MdModeEdit} from "../assets/Icons";
import { toggleSubscription } from "../features/subscriptions/subscriptionThunks";

function Profile() {
  const { userName } = useParams();

  const dispatch = useDispatch();

  const { user, loggedInUser } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(
          userProfile({ userName })
        ).unwrap();
      } catch (err) {
        dispatch(
          setError(
            err?.message ||
              "Something went wrong"
          )
        );
      }
    };

    fetchData();
  }, [userName, dispatch]);

  const handleOnToggleSubscription = async (
    channelId
  ) => {
    const res = await dispatch(
      toggleSubscription(channelId)
    ).unwrap();

    dispatch(updateToggleSubscription(res));
  };

  return (
    <div className="container-fluid px-0 text-light min-vh-100">

      {/* Cover Section */}
      <div
        className="position-relative"
        style={{
          height: "280px",
          backgroundImage: `url(${
            user?.coverImage ||
            "./defaultCover.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0 0 25px 25px",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,.8), rgba(0,0,0,.2))",
            borderRadius: "0 0 25px 25px",
          }}
        />

        {loggedInUser?._id === user?._id && (
          <Link to="/users/update-coverImage"
            className="position-absolute top-0 end-0 m-3 text-white"
          >
            <MdModeEdit size={24} />
          </Link>
        )}
      </div>

      {/* Profile Card */}
      <div className="container px-3 px-md-4">
        <div
          className="card border-0 shadow-lg"
          style={{
            marginTop: "-70px",
            backgroundColor: "#212121",
            borderRadius: "25px",
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">

              <Link
                to={
                  loggedInUser?._id === user?._id
                    ? "/users/update-avatar"
                    : ""
                }
              >
                <img
                  src={
                    user?.avatar ||
                    "./ProfilePic.jpg"
                  }
                  alt="Profile" width={140} height={140} className="rounded-circle"
                  style={{
                    objectFit: "cover",
                    border:
                      "4px solid #3ea6ff",
                  }}
                />
              </Link>

              <div className="flex-grow-1 text-center text-md-start">

                <h2 className="fw-bold mb-1">
                  {user?.fullName}
                </h2>

                <p className="text-secondary mb-1">
                  @{user?.userName}
                </p>

                <p className="text-secondary mb-3">
                  {user?.subscribersCount || 0} subscribers
                </p>

                {loggedInUser?._id === user?._id ? (
                  <Link
                    className="btn btn-outline-light rounded-pill px-4"
                    to="/users/update-details"
                  >
                    <MdManageAccounts
                      size={18}
                    />{" "}
                    Customize Channel
                  </Link>
                ) : (
                  <button className={`btn ${ user?.isSubscribed ? "btn-secondary" : "btn-danger"
                    } rounded-pill px-4`}
                    onClick={() =>
                      handleOnToggleSubscription(
                        user._id
                      )
                    }
                  >
                    <MdNotificationsActive
                      size={18}
                    />{" "}
                    {user?.isSubscribed
                      ? "Subscribed"
                      : "Subscribe"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4">
          <ul className="nav nav-pills gap-2">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link rounded-pill px-4 ${
                    isActive
                      ? "active bg-primary text-white"
                      : "text-secondary"
                  }`
                }
                to={`/users/profile/${userName}/videos`}
              >
                Videos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link rounded-pill px-4 ${
                    isActive
                      ? "active bg-primary text-white"
                      : "text-secondary"
                  }`
                }
                to={`/users/profile/${userName}/playlists`} >
                Playlists
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({ isActive }) =>
                  `nav-link rounded-pill px-4 ${
                    isActive
                      ? "active bg-primary text-white"
                      : "text-secondary"
                  }`
                }
                to={`/users/profile/${userName}/posts`}
              >
                Posts
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Nested Routes */}
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Profile;