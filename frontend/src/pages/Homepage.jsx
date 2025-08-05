import { useEffect, useState } from 'react'
import styles  from "./channel.module.css"
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { videosFetched } from '../features/videos/videoThunks';
import { formatTimeFromNow } from '../features/utils/formatTimeFromNow';

function Homepage() {

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [ sortType, setSortType ] = useState("desc");
  const { videos, totalPages } = useSelector(state => state.videos);

  useEffect(() => {
    dispatch(videosFetched({page, sortBy, sortType})).unwrap();
  },[dispatch, page, sortBy, sortType]);

  const handleOnVideo = (videoId) => {
    navigate(`/videos/video/${videoId}`);
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <div className="album py-2">
      <div className="container">
        {videos?.length > 0 && (
        <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
          <div className="btn-group btn-group-sm" role="group" > 
            <input type="radio" className="btn-check" name="btnradio" id='btnradio1' value="createdAt" autoComplete="off" checked={sortBy === "createdAt"} onChange={handleSortBy} />
            <label className="btn btn-outline-secondary" htmlFor="btnradio1">Created at</label>
            <input type="radio" className="btn-check" name="btnradio" id='btnradio2' value="views" autoComplete="off" checked={sortBy === "views"} onChange={handleSortBy} />
            <label className="btn btn-outline-secondary" htmlFor="btnradio2">Most viewed</label>
          </div>
          
          <select className="form-select form-select-sm bg-dark text-light w-auto" value={sortType} onChange={(e) => {setSortType(e.target.value)}}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        )}


        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          { videos && (
          videos?.map((video) => (
            <div className="col" key={video._id}>
            <div
              className="card bg-transparent text-light"
              style={{ minWidth: '350px', maxWidth: '400px', border: 'none' }}
            >
              <img src={video.thumbnail} onClick={() => {handleOnVideo(video._id)}} alt="Video thumbnail" className="card-img-top"
                style={{ height: '180px', objectFit: 'cover' }} />
                <div className="card-body px-0">
                <div className="d-flex align-items-start">
                  <Link to={`/users/profile/${video?.owner?.userName}`} >
                    <img src={video?.owner?.avatar} className="rounded-circle" width={35} height={35} alt="profile pic" />
                  </Link>
                  <p className={`${styles.multiLineTruncate} mb-0 ms-3 fw-bold`} style={{maxWidth: "260px"}}>
                    {video?.title}
                  </p>
                </div>
                  <p className="card-text mb-0 mt-2 ms-5" style={{"fontSize": "small"}}>{video?.owner?.userName}</p>
                  <small className="text-light ms-5" style={{"fontSize": "small"}}>{video.views} • {formatTimeFromNow(video.createdAt)}</small>
                </div>
                </div>
            </div>
            ))
          )}
        </div>
      </div>
      {videos?.length > 0 && (
      <nav className='position-relative' aria-label="...">
        <ul className="pagination position-absolute bottom-0 end-0">
          <li className="page-item"><button onClick={() => {setPage(page - 1)}} disabled={page === 1} className="page-link">&laquo;</button></li>
          {/* Page Number Buttons */}
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <li
                key={pageNumber}
                className={`page-item ${pageNumber === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            );
          })}
          <li className="page-item"><button className="page-link" onClick={() => {setPage(page + 1)}} disabled={page === totalPages} >&raquo;</button></li>
        </ul>
      </nav>
      )}
    </div>
  )
}

export default Homepage;