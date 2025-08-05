import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import VideoDetail from './VideoDetail';
import { IoIosAdd } from "../assets/Icons";
import { playlistById } from '../features/playlists/playlistThunk';
import { formatTimeFromNow } from '../features/utils/formatTimeFromNow';


function PlaylistPlayer() {

  const navigate = useNavigate();
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const { playlist } = useSelector(state => state.playlists);

  useEffect(() => {
    dispatch(playlistById(playlistId))
  }, [playlistId, dispatch])

  const [currentIndex, setCurrentIndex] = useState(0);
  let currentVideoId;

  useEffect(() => {
    setCurrentIndex(0); // Reset to first video on load
  }, [playlistId]);

  if(playlist?.videos?.length > 0){
    currentVideoId = playlist?.videos[currentIndex]?._id;
  };

  const handleAddVideo = () => {
    navigate(`/users/profile/${playlist?.creator?.userName}/videos`, {state: {playlistId}});
  };

  return (
    <div className="container py-4">
      { playlist?.videos?.length === 0 ? (
        <div className="text-light text-center mt-5">
          <h1>{playlist?.name}</h1>
          <h5>{formatTimeFromNow(playlist?.createdAt)}</h5>
          <img src={playlist?.creator?.avatar} className="rounded-circle" alt="" width={35} height={35} />
          <h6>by {playlist?.creator?.userName}</h6>
          <h6>{playlist?.description}</h6>
          <p className='text-secondary'>No videos</p>
          <button className="btn btn-light rounded-pill fw-2" onClick={handleAddVideo} > <IoIosAdd size={25} /> Add videos</button>
        </div>
      ) : (
      <div className="row g-3" >
        <div className='col-md-8' >
          <VideoDetail playlistId={playlistId} videoId={currentVideoId} />
        </div>
        <div className="col-md-4 text-light">
          <h5 className="mb-3">Playlist: {playlist?.name}</h5>
          <ul className="list-group bg-transparent">
            {playlist?.videos?.map((video, index) => (
              <li
                key={video._id}
                className={`list-group-item bg-dark text-light d-flex align-items-center position-relative gap-2 ${index === currentIndex ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentIndex(index)}
              >
                <img src={video.thumbnail} width={150} className="rounded" alt="thumbnail" />
                <h5>{video.title}</h5>
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}
    </div>
  );
}

export default PlaylistPlayer;

