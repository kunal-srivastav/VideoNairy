import styles from "./channel.module.css";
import { BsThreeDotsVertical, MdOutlinePlaylistPlay, AiOutlineDelete, AiOutlineEdit } from "../assets/Icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../features/users/userSlice";
import { deletePlaylist } from "../features/playlists/playlistThunk";
import { formatTimeFromNow } from "../features/utils/formatTimeFromNow";

function ProfilePlaylist() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loggedInUser } = useSelector(
    (state) => state.users
  );

  const { playlists } = useSelector(
    (state) => state.playlists
  );

  const handleOnPlaylistDelete = async (
    playlistId
  ) => {
    try {
      await dispatch(
        deletePlaylist(playlistId)
      ).unwrap();
    } catch (err) {
      dispatch(
        setError(
          err?.message ||
            "Something went wrong!"
        )
      );
    }
  };

  const handlePlayAll = (e, playlist) => {
    e.stopPropagation();

    navigate(
      `/playlists/play/${playlist._id}`
    );
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">

        {playlists?.length > 0 ? (
          playlists.map((playlist) => (
            <div className="col-12 col-sm-6 col-lg-4" key={playlist._id} >
              <div className="card border-0 shadow-sm h-100"
                style={{
                  backgroundColor: "#212121",
                  borderRadius: "18px",
                  overflow: "hidden",
                }}
              >
                {/* Thumbnail */}
                <div className="position-relative">

                  <img src={playlist?.playlistImage} alt="Playlist" className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />

                  {/* Video Count */}
                  <span className="badge bg-dark position-absolute bottom-0 end-0 m-2" >
                    <MdOutlinePlaylistPlay
                      size={16}
                    />{" "}
                    {playlist.videos.length} videos
                  </span>

                  {/* Play Overlay */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                      background:
                        "rgba(0,0,0,0.45)",
                      opacity: 0,
                      transition:
                        "opacity 0.25s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity =
                        "1")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.opacity =
                        "0")
                    }
                  >
                    <button className="btn btn-light rounded-pill fw-semibold px-4"
                      onClick={(e) =>
                        handlePlayAll(
                          e,
                          playlist
                        )
                      }
                    >
                      ▶ Play All
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="card-body text-light">
                  <div className="d-flex justify-content-between align-items-start">

                    <h6 className={`${styles.multiLineTruncate} fw-semibold`}
                      style={{
                        maxWidth: "85%",
                        lineHeight: "1.4",
                      }}
                    >
                      {playlist.name}
                    </h6>

                    {playlist?.creator ===
                      loggedInUser?._id && (
                      <div className="dropdown">
                        <button type="button" className="btn btn-sm btn-dark border-0"
                          data-bs-toggle="dropdown" >
                          <BsThreeDotsVertical />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                          <li>
                            <Link
                              className="dropdown-item"
                              to={`/playlists/update-playlist/${playlist._id}`}
                            >
                              <AiOutlineEdit className="me-2" />
                              Update
                            </Link>
                          </li>

                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() =>
                                handleOnPlaylistDelete(
                                  playlist._id
                                )
                              }
                            >
                              <AiOutlineDelete className="me-2" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <small className="text-secondary">
                      Updated{" "}
                      {formatTimeFromNow(
                        playlist.updatedAt
                      )}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-light d-flex flex-column justify-content-center"
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
              📂
            </div>

            <h4 className="mt-3">
              No playlists found
            </h4>

            <p className="text-secondary">
              Create your first playlist to
              organize videos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePlaylist;