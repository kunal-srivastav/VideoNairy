import styles  from "./channel.module.css";
import { AiOutlineDelete, AiOutlineEdit, BsThreeDotsVertical, TbPlaylistAdd } from "../assets/Icons";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVideo } from '../features/videos/videoThunks';
import { setError } from '../features/users/userSlice';
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
    const { user, loggedInUser } = useSelector(state => state.users);
    const { userVideos } = useSelector(state => state.videos);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    const handleOnVideoDelete = async (videoId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this video?");
        if (confirmDelete) {
            try {
                await dispatch(deleteVideo(videoId)).unwrap();
                setTimeout(() => {
                    navigate(`/users/profile/${user?.userName}`);
                }, 1500);
            } catch (err) {
                dispatch(setError(err || "Something went wrong!"));
            }
        }
    };

    const handleOnVideo = (videoId) => {
        navigate(`/videos/video/${videoId}`)
    };

    const handleAddToPlaylist = async (videoId) => {
        if(playlistId) {
        await dispatch(addVideoInPlaylist({playlistId, videoId})).unwrap();
        } else {
            setSelectedVideoId(videoId)
            setShowPlaylistModal(true)
        }
    };

  return (
    <div className="album py-2">
        <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3"> 

                {/* Profile Videos */}
                { userVideos && userVideos.length > 0  ? (
                userVideos?.map((video) => (
                    <div className="col" key={video._id}>
                    <div
                    className="card bg-transparent text-light"
                    style={{ minWidth: '350px', maxWidth: '400px', border: 'none' }}
                    >
                    <img onClick={() => {handleOnVideo(video._id)}} src={video.thumbnail} alt="Video thumbnail"
                        className="card-img-top"
                        style={{ height: '180px', objectFit: 'cover' }}
                    />
                        <div className="card-body px-0">
                        <div className="d-flex align-items-start justify-content-between">
                        <h5 className={`${styles.multiLineTruncate} mb-0 fw-bold`} style={{maxWidth: "320px"}}>
                            {video.title}
                        </h5>
                        {video.owner === loggedInUser?._id && (
                            <div className="dropdown">
                                <button type='button' className='flex-shrink-0 btn p-1 rounded-circle' data-bs-toggle="dropdown" aria-expanded="false" style={{"width": "30px", "height": "30px"}} >
                                    <BsThreeDotsVertical color='white' />
                                </button>
                                <ul className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={() => {handleAddToPlaylist(video._id)}}><TbPlaylistAdd className='me-1' /> Add to Playlist</button></li>
                                    <li><Link className="dropdown-item" to={`/videos/update-video/${video._id}`}><AiOutlineEdit className='me-1' /> Update</Link></li>
                                    <li><button className="dropdown-item" onClick={() => {handleOnVideoDelete(video._id)}}><AiOutlineDelete className='me-1' /> Delete</button></li>
                                </ul>
                            </div>
                        )}
                        </div>
                        <small className="text-secondary" style={{"fontSize": "small"}}>{video.views} • {formatTimeFromNow(video.createdAt)}</small>
                        </div>
                        </div>
                    </div>
                ))
                ) : (
                <div className="col text-center">
                    <h5 className="text-light">No videos found</h5>
                </div>
                )}
            </div>
        </div>
        {showPlaylistModal && (
            <SelectedPlaylist
                videoId={selectedVideoId}
                onClose={() => setShowPlaylistModal(false)}
            />
        )}
    </div>
  )
}

export default ProfileVideos