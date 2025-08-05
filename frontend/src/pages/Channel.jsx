import { useEffect, useRef } from 'react';
import {GrPrevious, GrNext } from "../assets/Icons";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { likedVideos } from '../features/likes/likeThunks';
import VideoCard from './VideoCard';
import { userWatchHistory } from '../features/users/userThunks';

function Channel() {

  const scrollHistory = useRef(null);
  const scrollLikedVideo = useRef(null);
  const dispatch = useDispatch()
  const { loggedInUser, watchHistory } = useSelector(state => state.users);
  const { allLikedVideos } = useSelector(state => state.likes);

  useEffect(() => {
    dispatch(userWatchHistory());
    dispatch(likedVideos());
  }, [loggedInUser, dispatch]);

  const scroll = (ref, direction) => {
    const { current } = ref;
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-4 text-light min-vh-100">
      {/* Profile Header */}
      <div className="d-flex align-items-center mb-4">
        <img  src={loggedInUser?.avatar || "./profilePic.jpg"} alt="Profile" className="rounded-circle" width={100} height={100} />
        <div className="ms-3">
          <h2 className="fw-bold mb-0">{loggedInUser?.fullName || "Unknown User"}</h2>
          <Link to={`/users/profile/${loggedInUser?.userName}`} className="text-decoration-none text-secondary">{loggedInUser?.userName || "@yourusername123"}• View channel</Link>
        </div>
      </div>

      {/* History Header with Buttons */}
      <div className="d-flex my-5 justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">History </h4>
        <div className="d-flex gap-2">
          <button className="btn btn-secondary rounded-pill">View all</button>
          <button onClick={() => scroll(scrollHistory, 'left')} className="btn btn-outline-light rounded-pill">
            <GrPrevious />
          </button>
          <button onClick={() => scroll(scrollHistory, 'right')} className="btn btn-outline-light rounded-pill">
            <GrNext />
          </button>
        </div>
      </div>

      {/* Scrollable History */}
      <div ref={scrollHistory} className="d-flex pb-3" style={{overflowX: "hidden" ,scrollBehavior: 'smooth', width: '100%' }}>
        {watchHistory?.length > 0 ? ( 
          watchHistory.map((video) => (
           <VideoCard key={video._id} video={video} /> )
        )
      ) : (
        <p className="text-light">No watched videos yet.</p>  
        )}
      </div>
      {/* Liked Video Header with Buttons */}
      <div className="d-flex my-5 justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Liked Videos
          <br />
          <span className='text-secondary' style={{"fontSize": "small"}}>{allLikedVideos?.length || 0}</span>
        </h4>
        <div className="d-flex gap-2">
          <button className="btn btn-secondary rounded-pill">View all</button>
          <button onClick={() => scroll(scrollLikedVideo, 'left')} className="btn btn-outline-light rounded-pill">
            <GrPrevious />
          </button>
          <button onClick={() => scroll(scrollLikedVideo, 'right')} className="btn btn-outline-light rounded-pill">
            <GrNext />
          </button>
        </div>
      </div>

      {/* Scrollable Liked Video */}
      <div ref={scrollLikedVideo} className="d-flex pb-3" style={{overflowX: "hidden" ,scrollBehavior: 'smooth', width: '100%' }} >
        {allLikedVideos?.length > 0 ? (
          allLikedVideos.map(({ video }) => <VideoCard key={video._id} video={video} />)
      ): (
        <p className="text-light">No liked videos yet.</p>  
        )}  
      </div>
    </div>
  );
}

export default Channel;
