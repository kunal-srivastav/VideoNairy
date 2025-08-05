import { Link } from "react-router-dom";
import { formatTimeFromNow } from "../features/utils/formatTimeFromNow";
import styles  from "./channel.module.css"

const VideoCard = ({ video }) => (

  <>
  <div className="card bg-transparent text-light me-4" style={{ minWidth: '250px', maxWidth: '250px', border: 'none' }}>
    <Link to={`/videos/video/${video?._id}`}><img src={video.thumbnail} alt="Video thumbnail" className="card-img-top" style={{ height: '140px', objectFit: 'cover' }} /></Link>
    <div className="card-body px-0">
      <div className="d-flex align-items-start justify-content-evenly">
        <Link to={`/users/profile/${video.owner?.userName}`}><img src={video.owner?.avatar} className="rounded-circle bg-success" width={35} height={35} alt="" /></Link>
        <p className={`${styles.multiLineTruncate} mb-0 fw-bold`} style={{ maxWidth: "170px" }}>{video.title}</p>
      </div>
      <p className="card-text mb-0 mt-2 ms-5">{video.owner?.userName}</p>
      <small className="text-light ms-5">{video.views} • {formatTimeFromNow(video.createdAt)}</small>
    </div>
  </div>
  </>
);


export default VideoCard;