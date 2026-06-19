import { AiOutlineDelete, AiOutlineEdit, BsThreeDotsVertical, AiOutlineLike, AiFillLike, FaRegCommentDots } from "../assets/Icons";
import { Link } from "react-router-dom";
import { deletePost } from "../features/posts/postThunks";
import { setError } from "../features/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toggleLikeOnPost } from "../features/likes/likeThunks";
import { updateLikeOnPostState } from "../features/posts/postSlice";
import { useEffect, useState } from "react";
import { userProfile } from "../features/users/userThunks";
import CommentSection from "./CommentSection";
import { formatTimeFromNow } from "../features/utils/formatTimeFromNow";

function ProfilePosts() {
  const dispatch = useDispatch();

  const { loggedInUser, user } = useSelector(
    (state) => state.users
  );

  const { posts } = useSelector(
    (state) => state.posts
  );

  const [activeCommentsPostId, setActiveCommentsPostId] =
    useState(null);

  useEffect(() => {
    if (user?.userName && loggedInUser?._id) {
      dispatch(
        userProfile({
          userName: user?.userName,
          loggedInUserId: loggedInUser._id,
        })
      );
    }
  }, [user?.userName, loggedInUser?._id]);

  const handleOnPostDelete = async (postId) => {
    try {
      await dispatch(deletePost(postId)).unwrap();
    } catch (err) {
      dispatch(
        setError(
          err?.message || "Post not deleted"
        )
      );
    }
  };

  const handleOnPostLike = async (postId) => {
    try {
      const res = await dispatch(
        toggleLikeOnPost(postId)
      ).unwrap();

      dispatch(updateLikeOnPostState(res));
    } catch (err) {
      dispatch(
        setError(
          err?.message || "Post not liked"
        )
      );
    }
  };

  const handleOnAllComments = (postId) => {
    setActiveCommentsPostId(
      activeCommentsPostId === postId
        ? null
        : postId
    );
  };

  return (
    <div className="container py-4">
      {posts?.length > 0 ? (
        <div className="row justify-content-center">
          {posts.map((post) => (
            <div className="col-12 col-lg-8 mb-4" key={post._id} >
              <div className="card border-0 shadow-sm"
                style={{
                  backgroundColor: "#212121",
                  borderRadius: "18px",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div className="card-body pb-2">
                  <div className="d-flex align-items-center">

                    <img src={user?.avatar} className="rounded-circle" width={45} height={45} alt="avatar"
                      style={{
                        objectFit: "cover",
                      }}
                    />

                    <div className="ms-3">
                      <h6 className="mb-0 text-white fw-semibold">
                        {user?.userName}
                      </h6>

                      <small className="text-secondary">
                        {formatTimeFromNow(
                          post.createdAt
                        )}
                      </small>
                    </div>

                    {post.postBy ===
                      loggedInUser?._id && (
                      <div className="dropdown ms-auto">
                        <button type="button" className="btn btn-dark border-0" data-bs-toggle="dropdown" >
                          <BsThreeDotsVertical color="white" />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                          <li>
                            <Link className="dropdown-item" to={`/posts/update/${post._id}`} >
                              <AiOutlineEdit className="me-2" />
                              Update
                            </Link>
                          </li>

                          <li>
                            <button className="dropdown-item text-danger"
                              onClick={() =>
                                handleOnPostDelete(
                                  post._id
                                )
                              }
                            >
                              <AiOutlineDelete className="me-2" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image */}
                <img src={post.postImage} alt="post" className="img-fluid"
                  style={{
                    maxHeight: "700px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />

                {/* Actions */}
                <div className="px-3 py-3">

                  <div className="d-flex align-items-center gap-4">

                    <button className="btn btn-dark border-0 d-flex align-items-center"
                      onClick={() =>
                        handleOnPostLike(post._id)
                      }
                    >
                      {post.isLiked ? (
                        <AiFillLike size={24} color="#0d6efd" />
                      ) : (
                        <AiOutlineLike size={24} color="white" />
                      )}

                      <span className="ms-2 text-light">
                        {post.totalLikes || 0}
                      </span>
                    </button>

                    <button className="btn btn-dark border-0 d-flex align-items-center"
                      onClick={() =>
                        handleOnAllComments(
                          post._id
                        )
                      }
                    >
                      <FaRegCommentDots size={22} color="white" />

                      <span className="ms-2 text-light">
                        Comments
                      </span>
                    </button>
                  </div>

                  {/* Comments */}
                  {activeCommentsPostId ===
                    post._id && (
                    <div className="mt-3 border-top border-secondary pt-3">
                      <CommentSection
                        postId={post._id}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-light d-flex flex-column justify-content-center"
          style={{
            minHeight: "300px",
          }}
        >
          <div
            style={{
              fontSize: "70px",
              opacity: 0.5,
            }}
          >
            📸
          </div>

          <h4 className="mt-3">
            No posts yet
          </h4>

          <p className="text-secondary">
            Posts shared by this user will
            appear here.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProfilePosts;