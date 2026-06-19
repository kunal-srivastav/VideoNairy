import { useEffect, useRef } from "react";
import { GrPrevious, GrNext } from "../assets/Icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likedVideos } from "../features/likes/likeThunks";
import VideoCard from "./VideoCard";
import { userWatchHistory } from "../features/users/userThunks";

function Channel() {
  const scrollHistory = useRef(null);
  const scrollLikedVideo = useRef(null);

  const dispatch = useDispatch();

  const { loggedInUser, watchHistory } = useSelector(
    (state) => state.users
  );

  const { allLikedVideos } = useSelector(
    (state) => state.likes
  );

  useEffect(() => {
    dispatch(userWatchHistory());
    dispatch(likedVideos());
  }, [loggedInUser, dispatch]);

  const scroll = (ref, direction) => {
    const { current } = ref;

    if (direction === "left") {
      current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    } else {
      current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container-fluid px-3 px-md-5 py-4 text-light min-vh-100">

      {/* Profile Header */}
      <div
        className="card border-0 shadow-sm mb-5"
        style={{
          backgroundColor: "#212121",
          borderRadius: "24px",
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">

            <img
              src={
                loggedInUser?.avatar ||
                "./profilePic.jpg"
              } alt="Profile" width={120} height={120} className="rounded-circle"
              style={{
                objectFit: "cover",
                border: "4px solid #3ea6ff",
              }}
            />

            <div>
              <h2 className="fw-bold mb-1">
                {loggedInUser?.fullName ||
                  "Unknown User"}
              </h2>

              <Link to={`/users/profile/${loggedInUser?.userName}`} className="text-decoration-none text-secondary" >
                @{loggedInUser?.userName}
              </Link>

              <div className="mt-2">
                <span className="badge bg-primary rounded-pill">
                  Creator
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watch History */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-0">
            Watch History
          </h4>

          <small className="text-secondary">
            {watchHistory?.length || 0} videos
          </small>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-secondary rounded-pill px-3">
            View All
          </button>

          <button
            onClick={() =>
              scroll(scrollHistory, "left")
            }
            className="btn btn-outline-light rounded-circle"
          >
            <GrPrevious />
          </button>

          <button
            onClick={() =>
              scroll(scrollHistory, "right")
            }
            className="btn btn-outline-light rounded-circle"
          >
            <GrNext />
          </button>
        </div>
      </div>

      <div ref={scrollHistory} className="d-flex gap-3 pb-3"
        style={{
          overflowX: "hidden",
          scrollBehavior: "smooth",
        }}
      >
        {watchHistory?.length > 0 ? (
          watchHistory.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
            />
          ))
        ) : (
          <div
            className="card border-0 w-100"
            style={{
              backgroundColor: "#212121",
              borderRadius: "18px",
            }}
          >
            <div className="card-body text-center py-5">
              <h5>No watched videos yet</h5>
              <p className="text-secondary mb-0">
                Videos you watch will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Liked Videos */}
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <div>
          <h4 className="fw-bold mb-0">
            Liked Videos
          </h4>

          <small className="text-secondary">
            {allLikedVideos?.length || 0} videos
          </small>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-secondary rounded-pill px-3">
            View All
          </button>

          <button
            onClick={() =>
              scroll(scrollLikedVideo, "left")
            } className="btn btn-outline-light rounded-circle" >
            <GrPrevious />
          </button>

          <button
            onClick={() =>
              scroll(scrollLikedVideo, "right")
            }
            className="btn btn-outline-light rounded-circle" >
            <GrNext />
          </button>
        </div>
      </div>

      <div
        ref={scrollLikedVideo}
        className="d-flex gap-3 pb-3"
        style={{
          overflowX: "hidden",
          scrollBehavior: "smooth",
        }}
      >
        {allLikedVideos?.length > 0 ? (
          allLikedVideos.map(({ video }) => (
            <VideoCard
              key={video._id}
              video={video}
            />
          ))
        ) : (
          <div
            className="card border-0 w-100"
            style={{
              backgroundColor: "#212121",
              borderRadius: "18px",
            }}
          >
            <div className="card-body text-center py-5">
              <h5>No liked videos yet</h5>
              <p className="text-secondary mb-0">
                Videos you like will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Channel;