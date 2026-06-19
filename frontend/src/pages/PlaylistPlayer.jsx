import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import VideoDetail from "./VideoDetail";
import { IoIosAdd } from "../assets/Icons";
import { playlistById } from "../features/playlists/playlistThunk";
import { formatTimeFromNow } from "../features/utils/formatTimeFromNow";

function PlaylistPlayer() {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const dispatch = useDispatch();

  const { playlist } = useSelector((state) => state.playlists);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(playlistById(playlistId));
  }, [playlistId, dispatch]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [playlistId]);

  let currentVideoId;

  if (playlist?.videos?.length > 0) {
    currentVideoId = playlist?.videos[currentIndex]?._id;
  }

  const handleAddVideo = () => {
    navigate(
      `/users/profile/${playlist?.creator?.userName}/videos`,
      { state: { playlistId } }
    );
  };

  return (
    <div className="container-fluid text-light py-4" style={{ minHeight: "100vh" }} >
      {/* Empty Playlist */}
      {playlist?.videos?.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }} >
          <div className="text-center p-5 rounded-4"
            style={{
              background: "#1f1f1f",
              maxWidth: "700px",
              width: "100%",
            }}
          >
            <img src={playlist?.creator?.avatar} alt="" width={90} height={90}
              className="rounded-circle mb-3 border border-3 border-secondary" />

            <h1 className="fw-bold">{playlist?.name}</h1>

            <p className="text-secondary mb-2">
              Created {formatTimeFromNow(playlist?.createdAt)}
            </p>

            <h6 className="mb-3">
              by{" "}
              <span className="text-danger">
                @{playlist?.creator?.userName}
              </span>
            </h6>

            <p className="text-secondary">
              {playlist?.description || "No description available"}
            </p>

            <div className="my-4">
              <h4>No Videos Added Yet</h4>
              <p className="text-secondary">
                Start building your playlist by adding videos.
              </p>
            </div>

            <button className="btn btn-danger rounded-pill px-4" onClick={handleAddVideo} >
              <IoIosAdd size={24} />
              <span className="ms-2">Add Videos</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Video Player */}
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden"
              style={{
                background: "#181818",
                border: "1px solid #2d2d2d",
              }}
            >
              <VideoDetail playlistId={playlistId} videoId={currentVideoId} />
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="col-lg-4">
            <div className="rounded-4 overflow-hidden"
              style={{
                background: "#181818",
                border: "1px solid #2d2d2d",
              }} >
              {/* Header */}
              <div className="p-4 border-bottom border-secondary">
                <h4 className="fw-bold mb-1">
                  {playlist?.name}
                </h4>

                <small className="text-secondary">
                  {playlist?.videos?.length} Videos
                </small>

                <p className="text-secondary small mt-2 mb-0">
                  {playlist?.description}
                </p>
              </div>

              {/* Videos */}
              <div
                style={{
                  maxHeight: "75vh",
                  overflowY: "auto",
                }}
              >
                {playlist?.videos?.map((video, index) => (
                  <div key={video._id} onClick={() => setCurrentIndex(index)}
                    className={`d-flex gap-3 p-3 border-bottom ${
                      currentIndex === index
                        ? "bg-danger bg-opacity-25"
                        : ""
                    }`}
                    style={{
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                  >
                    {/* Number */}
                    <div className="d-flex align-items-center justify-content-center fw-bold text-secondary"
                      style={{
                        minWidth: "25px",
                      }} >
                      {index + 1}
                    </div>

                    {/* Thumbnail */}
                    <img src={video.thumbnail} alt="" className="rounded"
                      style={{
                        width: "140px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />

                    {/* Info */}
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-1"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }} >
                        {video.title}
                      </h6>

                      <small className="text-secondary d-block">
                        {video.owner?.userName}
                      </small>

                      <small className="text-secondary">
                        {video.views} views
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 text-center">
                <button className="btn btn-outline-light rounded-pill" onClick={handleAddVideo} >
                  <IoIosAdd size={20} />
                  <span className="ms-2">Add More Videos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistPlayer;