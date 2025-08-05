import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineLike, AiFillLike, FaRegCommentDots } from '../assets/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { videoById } from '../features/videos/videoThunks';
import { updateLikeOnVideoState, updateSubscription } from '../features/videos/videoSilce';
import { setError } from '../features/users/userSlice';
import { toggleLikeOnVideo } from '../features/likes/likeThunks';
import { toggleSubscription } from '../features/subscriptions/subscriptionThunks';
import { commentsOnVideo } from '../features/comments/commentThunks';
import CommentSection from './CommentSection';
import ReactPlayer from "react-player"
import { formatTimeFromNow } from '../features/utils/formatTimeFromNow';

function VideoDetail({playlistId, videoId}) {

  const params = useParams();
  const finalVideoId = videoId || params.videoId;
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const { totalComments } = useSelector(state => state.comments);
  const { loggedInUser } = useSelector(state => state.users);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest")
  const isLoggedIn = !!loggedInUser;
  const { video } = useSelector(state => state.videos);
  const { video: videoData, isLiked, isSubscribed, totalLikes, totalSubscriber } = video || {};
  const { owner, videoFile, description, title, views, createdAt } = videoData || {};

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        await dispatch(videoById(finalVideoId)).unwrap();
        await dispatch(commentsOnVideo({videoId: finalVideoId, page, sortBy})).unwrap();
      } catch (err) {
          dispatch(setError(err?.message || "video not found"));
      }
    }
    fetchVideoDetails();
  }, [finalVideoId, dispatch, page, sortBy]);

  const handleOnSubscribedBtn = async (channelId) => {
    try {
      if(isLoggedIn) {
      const res = await dispatch(toggleSubscription(channelId)).unwrap();
      dispatch(updateSubscription(res));
      } else {
        navigate(`/users/login`);
      }
    } catch (err) {
      dispatch(setError(err?.message || "toggle subscribed btn error"));
    }
  }

  const handleOnLikeVideo = async () => {
    try {
      if(isLoggedIn){
      const res = await dispatch(toggleLikeOnVideo({videoId: finalVideoId})).unwrap();
      dispatch(updateLikeOnVideoState(res));
      } else {
        navigate("/users/login");
      }
    } catch (err) {
      dispatch(setError(err?.message || "Failed to like video"));
    }
  };

  if (!videoData) return <p className="text-light text-center mt-5">Loading...</p>;

  return (
    <div className="container py-4">
      <div className="row text-light">
        <div className={playlistId? "" : "col-md-8"}>
          <ReactPlayer width="100%" controls url={videoFile} >
            Your browser does not support the video tag.
          </ReactPlayer>

          <h2 className="mt-3" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
            {title}
          </h2>

          <div className="collapse" id="collapseExample">
            <div className="card card-body" style={{ backgroundColor: '#303030' }}>
              {description}
            </div>
          </div>

          <small>
            {views} views • {formatTimeFromNow(createdAt)}
          </small>
          <div className="my-3 container d-flex align-items-center justify-content-between">
            {/* Left: Avatar and user info */}
            <div className="d-flex align-items-center gap-3">
              <img
                src={owner?.avatar}
                onClick={() => {navigate(`/users/profile/${owner?.userName}`)}}
                className="rounded-circle"
                width={40}
                height={40}
                alt="Uploader avatar"
              />
              <div>
                <h6 className="mb-0 text-white">{owner?.userName}</h6>
                <small className="text-secondary">{totalSubscriber}</small>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-light rounded-pill fw-semibold px-3" data-bs-toggle="collapse" href="#collapseExample2" onClick={() => {handleOnSubscribedBtn(owner?._id)}} >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>

              <button  onClick={handleOnLikeVideo}
              className="btn d-flex align-items-center gap-1 rounded-pill px-3"
              style={{ backgroundColor: '#303030', color: 'white' }} >
              {isLiked ? <AiFillLike size={20} /> :  <AiOutlineLike size={20} /> }
              <span>{totalLikes}</span>
              </button>

              <button
              className="btn d-flex align-items-center gap-1 rounded-pill px-3"
              style={{ backgroundColor: '#303030', color: 'white' }} disabled
              >
              <FaRegCommentDots size={20} />
              <span>{totalComments}</span>
              </button>
            </div>
          </div>
        </div>
      {!playlistId && (
      <div className='col-md-4'>
        <CommentSection sortBy={sortBy} setSortBy={setSortBy} page={page} setPage={setPage} />
      </div>
      )}
      </div>
    </div>
  );
}

export default VideoDetail;
