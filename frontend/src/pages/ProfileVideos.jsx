import styles from "./channel.module.css";
import { AiOutlineDelete, AiOutlineEdit, BsThreeDotsVertical,TbPlaylistAdd } from "../assets/Icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteVideo } from "../features/videos/videoThunks";
import { setError } from "../features/users/userSlice";
import { useState } from "react";
import { addVideoInPlaylist } from "../features/playlists/playlistThunk";
import SelectedPlaylist from "./SelectedPlaylist";
import { formatTimeFromNow } from "../features/utils/formatTimeFromNow";

function ProfileVideos() {
  const location = useLocation();
  const playlistId = location.state?.playlistId;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const { user, loggedInUser } = useSelector(
    (state) => state.users
  );

  const { userVideos } = useSelector(
    (state) => state.videos
  );

  const handleOnVideoDelete = async (videoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (confirmDelete) {
      try {
        await dispatch(deleteVideo(videoId)).unwrap();

        setTimeout(() => {
          navigate(
            `/users/profile/${user?.userName}`
          );
        }, 1500);
      } catch (err) {
        dispatch(
          setError(
            err || "Something went wrong!"
          )
        );
      }
    }
  };

  const handleOnVideo = (videoId) => {
    navigate(`/videos/video/${videoId}`);
  };

  const handleAddToPlaylist = async (
    videoId
  ) => {
    if (playlistId) {
      await dispatch(
        addVideoInPlaylist({
          playlistId,
          videoId,
        })
      ).unwrap();
    } else {
      setSelectedVideoId(videoId);
      setShowPlaylistModal(true);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">

        {userVideos && userVideos.length > 0 ? (
          userVideos.map((video) => (
            <div className="col-12 col-sm-6 col-lg-4" key={video._id} >
              <div className="card border-0 h-100 shadow-sm"
                style={{
                  backgroundColor: "#212121",
                  borderRadius: "18px",
                  overflow: "hidden",
                }}
              >
                {/* Thumbnail */}
                <div className="position-relative"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleOnVideo(video._id)
                  }
                >
                  <img src={video.thumbnail} alt="Video thumbnail" className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />

                  <span
                    className="position-absolute bottom-0 end-0 m-2 badge bg-dark"
                  >
                    {video.views} views
                  </span>
                </div>

                {/* Content */}
                <div className="card-body text-light">
                  <div className="d-flex justify-content-between align-items-start">

                    <h6
                      className={`${styles.multiLineTruncate} fw-semibold mb-2`}
                      style={{
                        maxWidth: "85%",
                        lineHeight: "1.4",
                      }}
                    >
                      {video.title}
                    </h6>

                    {video.owner ===
                      loggedInUser?._id && (
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-sm btn-dark border-0"
                          data-bs-toggle="dropdown"
                        >
                          <BsThreeDotsVertical />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleAddToPlaylist(
                                  video._id
                                )
                              }
                            >
                              <TbPlaylistAdd className="me-2" />
                              Add to Playlist
                            </button>
                          </li>

                          <li>
                            <Link
                              className="dropdown-item"
                              to={`/videos/update-video/${video._id}`}
                            >
                              <AiOutlineEdit className="me-2" />
                              Update Video
                            </Link>
                          </li>

                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() =>
                                handleOnVideoDelete(
                                  video._id
                                )
                              }
                            >
                              <AiOutlineDelete className="me-2" />
                              Delete Video
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-secondary">
                      {formatTimeFromNow(
                        video.createdAt
                      )}
                    </small>

                    <small className="text-secondary">
                      {video.views} views
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="col-12 text-center text-light d-flex flex-column justify-content-center"
            style={{
              minHeight: "300px",
            }}
          >
            <div
              style={{
                fontSize: "70px",
                opacity: 0.5,
              }}
            >
              🎬
            </div>

            <h4 className="mt-3">
              No videos uploaded
            </h4>

            <p className="text-secondary">
              Upload your first video to get
              started.
            </p>
          </div>
        )}
      </div>

      {showPlaylistModal && (
        <SelectedPlaylist
          videoId={selectedVideoId}
          onClose={() =>
            setShowPlaylistModal(false)
          }
        />
      )}
    </div>
  );
}

export default ProfileVideos;