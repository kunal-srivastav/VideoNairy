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
    dispatch(videosFetched({ page, sortBy, sortType })).unwrap();
  }, [dispatch, page, sortBy, sortType]);

  const handleOnVideo = (videoId) => {
    navigate(`/videos/video/${videoId}`);
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <div className="py-3">
      <div className="container-fluid px-2 px-md-4">
        {videos?.length > 0 && (
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="btn-group" role="group">
              <input type="radio" className="btn-check" name="btnradio" id="btnradio1" value="createdAt"
                autoComplete="off" checked={sortBy === "createdAt"} onChange={handleSortBy}
              />

              <label className="btn btn-outline-secondary rounded-pill" htmlFor="btnradio1" >
                Latest
              </label>

              <input type="radio" className="btn-check" name="btnradio" id="btnradio2" value="views"
                autoComplete="off" checked={sortBy === "views"} onChange={handleSortBy} />

              <label className="btn btn-outline-secondary rounded-pill" htmlFor="btnradio2" >
                Most Viewed
              </label>
            </div>

            <select className="form-select bg-dark text-light border-secondary"
              style={{
                width: "160px",
              }} value={sortType} onChange={(e) => { setSortType(e.target.value); }} >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {videos &&
            videos.map((video) => (
              <div className="col" key={video._id}>
                <div className="card bg-transparent border-0 text-light h-100"
                  style={{
                    cursor: "pointer",
                    transition: "all .2s ease",
                  }}
                >
                  <div className="overflow-hidden rounded-4"
                    onClick={() => {
                      handleOnVideo(video._id);
                    }}
                  >
                    <img src={video.thumbnail} alt="Video thumbnail" className="card-img-top"
                      style={{
                        aspectRatio: "16/9",
                        objectFit: "cover",
                        transition: "transform .3s ease",
                      }}
                    />
                  </div>

                  <div className="card-body px-1 py-3">
                    <div className="d-flex align-items-start">
                      <Link to={`/users/profile/${video?.owner?.userName}`} >
                        <img src={video?.owner?.avatar} className="rounded-circle" width={40}
                          height={40} alt="profile pic"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </Link>

                      <div className="ms-3">
                        <p className={`${styles.multiLineTruncate} fw-semibold mb-1`}
                          style={{
                            lineHeight: "1.4",
                            fontSize: "0.95rem",
                          }}
                        >
                          {video?.title}
                        </p>

                        <p className="mb-0 text-secondary"
                          style={{
                            fontSize: ".85rem",
                          }}
                        >
                          {video?.owner?.userName}
                        </p>

                        <small className="text-secondary"
                          style={{
                            fontSize: ".8rem",
                          }}
                        >
                          {video.views} views •{" "}
                          {formatTimeFromNow(video.createdAt)}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {videos?.length > 0 && (
        <nav className="d-flex justify-content-center mt-4" aria-label="Pagination" >
          <ul className="pagination">
            <li className="page-item">
              <button
                onClick={() => {
                  setPage(page - 1);
                }}
                disabled={page === 1}
                className="page-link"
              >
                &laquo;
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
                  <button className="page-link" onClick={() => setPage(pageNumber)} >
                    {pageNumber}
                  </button>
                </li>
              );
            })}

            <li className="page-item">
              <button className="page-link"
                onClick={() => {
                  setPage(page + 1);
                }}
                disabled={page === totalPages}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Homepage;