import { AiOutlineDelete, AiOutlineEdit, BsThreeDotsVertical, AiOutlineLike, AiFillLike, FaRegCommentDots } from "../assets/Icons";
import { Link } from 'react-router-dom';
import { deletePost } from '../features/posts/postThunks';
import { setError } from '../features/users/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikeOnPost } from '../features/likes/likeThunks';
import { updateLikeOnPostState } from '../features/posts/postSlice';
import { useEffect, useState } from "react";
import { userProfile } from "../features/users/userThunks";
import CommentSection from "./CommentSection";
import { formatTimeFromNow } from "../features/utils/formatTimeFromNow";

function ProfilePosts() {

    const dispatch = useDispatch();
    const { loggedInUser, user } = useSelector(state => state.users);
    const { posts } = useSelector(state => state.posts);
    const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);

    useEffect(() => {
        if (user?.userName && loggedInUser?._id) {
            dispatch(userProfile({ userName: user?.userName, loggedInUserId: loggedInUser._id }));
        }
    }, [user?.userName, loggedInUser?._id]);

    const handleOnPostDelete = async (postId) => {
        try {
            await dispatch(deletePost(postId)).unwrap();
        } catch (err) {
            dispatch(setError(err?.message || "Post not deleted"));
        }
    };

    const handleOnPostLike = async (postId) => {
        try {
            const res = await dispatch(toggleLikeOnPost(postId)).unwrap();
            dispatch(updateLikeOnPostState(res));
        } catch (err) {
            dispatch(setError(err?.message || "Post not liked"));
        }
    };

    const handleOnAllComments = async (postId) => {
        setActiveCommentsPostId(activeCommentsPostId === postId ? null : postId)
    };

  return (
    <div className="container">
      {posts?.length > 0 ? (
        <div className="row">
          {posts.map((post) => (
            <div className="col-12 col-md-10 col-lg-8 mb-4" key={post._id}>
              <div className="card bg-transparent text-light border">
                <div className="card-body d-flex align-items-center flex-wrap">
                  <img src={user?.avatar} className="rounded-circle" width={30} height={30} alt="Post thumbnail" />
                  <h5 className="card-title ms-3 mt-1 p-0">{user?.userName}</h5>
                  <p className="card-text ms-3 mt-2 p-0">
                    <small className="text-secondary">{formatTimeFromNow(post.createdAt)}</small>
                  </p>
                  {post.postBy === loggedInUser?._id && (
                    <div className="dropdown ms-auto">
                      <button
                        type="button"
                        className="btn p-1 rounded-circle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <BsThreeDotsVertical color="white" />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                        <li>
                          <Link className="dropdown-item" to={`/posts/update/${post._id}`}>
                            <AiOutlineEdit className="me-1" /> Update
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleOnPostDelete(post._id)}
                          >
                            <AiOutlineDelete className="me-1" color="red" /> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <img
                  src={post.postImage}
                  className="img-fluid mx-auto d-block"
                  style={{ maxHeight: "700px", objectFit: "cover" }}
                  alt="post"
                />

                <div className="d-flex flex-wrap align-items-center gap-3 p-3">
                  <button type="button" className="btn rounded-circle" onClick={() => handleOnPostLike(post._id)}>
                    {post.isLiked ? (
                      <AiFillLike size={25} color="white" />
                    ) : (
                      <AiOutlineLike color="white" size={25} />
                    )}
                    <small className="ms-2 text-secondary">{post.totalLikes || 0}</small>
                  </button>

                  <button
                    type="button"
                    className="btn"
                    aria-controls={`collapse-${post._id}`}
                    onClick={() => handleOnAllComments(post._id)}
                  >
                    <FaRegCommentDots color="white" size={20} />
                  </button>
                </div>

                {activeCommentsPostId === post._id && (
                  <div className="collapse show ms-3" id={`collapse-${post._id}`}>
                    <CommentSection postId={post._id} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h5 className="text-light">No posts found</h5>
        </div>
      )}
    </div>
  );
}


export default ProfilePosts;