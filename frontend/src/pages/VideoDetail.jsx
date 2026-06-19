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
  <div className="container-fluid py-4">
    <div className="row g-4 text-light">

      {/* Video Section */}
      <div className={playlistId ? "col-12" : "col-lg-8"}>
        <div
          className="bg-dark rounded-4 overflow-hidden shadow-lg"
          style={{ border: "1px solid #2a2a2a" }}
        >
          <ReactPlayer url={videoFile} controls width="100%" height="70vh" />
        </div>

        {/* Title */}
        <h3 className="fw-bold mt-4">{title}</h3>

        {/* Video Stats */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">

          {/* Channel Info */}
          <div className="d-flex align-items-center gap-3">
            <img src={owner?.avatar} alt="" width={50} height={50} className="rounded-circle"
              style={{
                cursor: "pointer",
                objectFit: "cover",
              }}
              onClick={() =>
                navigate(`/users/profile/${owner?.userName}`)
              }
            />

            <div>
              <h6 className="mb-0 fw-bold">
                {owner?.userName}
              </h6>

              <small className="text-secondary">
                {totalSubscriber} subscribers
              </small>
            </div>

            <button
              onClick={() =>
                handleOnSubscribedBtn(owner?._id)
              }
              className={`btn rounded-pill px-4 fw-semibold ${
                isSubscribed
                  ? "btn-secondary"
                  : "btn-danger"
              }`}
            >
              {isSubscribed
                ? "Subscribed"
                : "Subscribe"}
            </button>
          </div>

          {/* Actions */}
          <div className="d-flex gap-2 mt-3 mt-md-0">

            <button onClick={handleOnLikeVideo} className="btn btn-dark rounded-pill px-4" >
              {isLiked ? (
                <AiFillLike size={20} />
              ) : (
                <AiOutlineLike size={20} />
              )}

              <span className="ms-2">
                {totalLikes}
              </span>
            </button>

            <button disabled className="btn btn-dark rounded-pill px-4" >
              <FaRegCommentDots size={18} />
              <span className="ms-2">
                {totalComments}
              </span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 p-4 rounded-4"
          style={{
            background: "#1f1f1f",
            border: "1px solid #2f2f2f",
          }}
        >
          <div className="d-flex gap-3 mb-3">
            <span>{views} views</span>
            <span>
              {formatTimeFromNow(createdAt)}
            </span>
          </div>

          <p className="mb-0 text-secondary"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Comments */}
      {!playlistId && (
        <div className="col-lg-4">
          <div className="p-3 rounded-4"
            style={{
              background: "#181818",
              border: "1px solid #2a2a2a",
              position: "sticky",
              top: "80px",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <CommentSection sortBy={sortBy} setSortBy={setSortBy} page={page} setPage={setPage} />
          </div>
        </div>
      )}

    </div>
  </div>
);
}

export default VideoDetail;
