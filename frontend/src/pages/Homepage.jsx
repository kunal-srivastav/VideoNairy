import { useEffect, useState } from "react";
import styles from "./channel.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { videosFetched } from "../features/videos/videoThunks";
import { formatTimeFromNow } from "../features/utils/formatTimeFromNow";

function Homepage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");

  const { videos, totalPages } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(videosFetched({ page, sortBy, sortType }));
  }, [dispatch, page, sortBy, sortType]);

  const handleOnVideo = (videoId) => {
    navigate(`/videos/video/${videoId}`);
  };

  return (
    <div className="container-fluid py-4"
      style={{
        background: "#0f0f0f",
        minHeight: "100vh",
      }}
    >
      {/* Filters */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div className="d-flex gap-2">
          <button
            className={`btn rounded-pill px-4 ${
              sortBy === "createdAt"
                ? "btn-light text-dark"
                : "btn-dark text-light"
            }`}
            onClick={() => {
              setSortBy("createdAt");
              setPage(1);
            }}
          >
            Latest
          </button>

          <button
            className={`btn rounded-pill px-4 ${
              sortBy === "views"
                ? "btn-light text-dark"
                : "btn-dark text-light"
            }`}
            onClick={() => {
              setSortBy("views");
              setPage(1);
            }}
          >
            Trending
          </button>
        </div>

        <select className="form-select border-0 text-light"
          style={{
            width: "170px",
            background: "#1f1f1f",
            borderRadius: "12px",
          }}
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Video Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {videos?.map((video) => (
          <div className="col" key={video._id}>
            <div className="h-100" style={{ cursor: "pointer" }} >
              {/* Thumbnail */}
              <div className="position-relative overflow-hidden"
                style={{ borderRadius: "16px" }} onClick={() => handleOnVideo(video._id)} >
                <img src={video.thumbnail} alt={video.title} className="w-100"
                  style={{
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    transition: "0.35s ease",
                    borderRadius: "16px",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </div>

              {/* Video Info */}
              <div className="d-flex mt-3">
                <Link to={`/users/profile/${video?.owner?.userName}`}>
                  <img src={video?.owner?.avatar} alt="avatar" width={42} height={42}
                    className="rounded-circle" style={{ objectFit: "cover" }} />
                </Link>

                <div className="ms-3 flex-grow-1">
                  <h6 className={`${styles.multiLineTruncate} text-light fw-semibold mb-1`}
                    style={{ lineHeight: "1.4", }} >
                    {video.title}
                  </h6>

                  <small className="d-block" style={{ color: "#aaaaaa" }} >
                    {video.owner?.userName}
                  </small>

                  <small style={{ color: "#888" }} >
                    {video.views.toLocaleString()} views •{" "}
                    {formatTimeFromNow(video.createdAt)}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {videos?.length > 0 && (
        <div className="d-flex justify-content-center mt-5">
          <nav>
            <ul className="pagination pagination-lg">

              <li className="page-item">
                <button className="page-link bg-dark text-light border-secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  ←
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => {
                const pageNumber = i + 1;

                return (
                  <li key={pageNumber}
                    className={`page-item ${
                      pageNumber === page ? "active" : ""
                    }`}
                  >
                    <button className={`page-link ${
                        pageNumber === page
                          ? "bg-danger border-danger"
                          : "bg-dark text-light border-secondary"
                      }`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                );
              })}

              <li className="page-item">
                <button className="page-link bg-dark text-light border-secondary" disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  →
                </button>
              </li>

            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Homepage;