import { useEffect, useState } from 'react'
import { AiOutlineLike, AiFillLike, BsThreeDotsVertical} from "../assets/Icons";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentOnVideo, addCommentInPost, commentsOnPost, deleteComment, updateComment } from '../features/comments/commentThunks';
import { setError } from '../features/users/userSlice';
import { updateCommentOnLikeState } from "../features/comments/commentSlice"
import { toggleLikeOnComment } from '../features/likes/likeThunks';
import { formatTimeFromNow } from '../features/utils/formatTimeFromNow';


function CommentSection({postId, sortBy, setSortBy, page, setPage}) {

    const { videoId } = useParams();
    const [isEditingCommentId, setIsEditingCommentId] = useState(null);
  
    const [commentContent, setCommentContent] = useState("");

    const dispatch = useDispatch();
    const { comments, totalComments, postComments, totalCommentsOnPost, totalPages} = useSelector(state => state.comments);
    const { loggedInUser } = useSelector(state => state.users);

    useEffect(() => {
      if(postId) {
      dispatch(commentsOnPost(postId));
      }
    }, [postId, dispatch]);

  const handleOnLikeComment = async (commentId) => {
    try {
      const res = await dispatch(toggleLikeOnComment({commentId})).unwrap();
      dispatch(updateCommentOnLikeState(res));
    } catch (err) {
      dispatch(setError(err?.message || "Comment not liked"));
    }
  };

  const handleOnCommentBtn = async () => {
    try {
      if(isEditingCommentId){
        await dispatch(updateComment({isEditingCommentId, commentContent})).unwrap();
        setIsEditingCommentId(null); 
      } else {
        if(videoId) {
          await dispatch(addCommentOnVideo({videoId, commentContent})).unwrap();
        } else {
           await dispatch(addCommentInPost({postId, commentContent})).unwrap();
        }
      }
      setCommentContent("");
    } catch (err) {
      dispatch(setError(err?.message || "Something went wrong"));
    }
  };

  const handleOnCommentEditBtn = async (commentId, contentText) => {
    setIsEditingCommentId(commentId);
    setCommentContent(contentText);
  };

  const handleOnCommentDeleteBtn = async (commentId) => {
    try {
      await dispatch(deleteComment({commentId})).unwrap();
    } catch (err) {
      dispatch(setError(err?.message || "Comment not deleted"));
    }
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
  };

  const commentList = postId ? postComments : comments;
  const numberOfComments = postId ? totalCommentsOnPost : totalComments;

  return (
    <div>
    <div className="text-light">
    <h5 className='fw-bold text-light mb-4'>{numberOfComments? `${numberOfComments} Comments` : "No Comment Found" }</h5>


    {/* Comment input */}

    <div className="card card-body bg-transparent border-0">
      <div className="d-flex gap-3 mb-4 p-3 rounded-4"
      style={{
      backgroundColor: "#1f1f1f",
      border: "1px solid #333",
      }}
>
        <img src={loggedInUser?.avatar || "/profilePic.jpg"} alt="User" className="rounded-circle me-2" width={40} height={40} />
        <div>
            <h6 className="mb-1">{loggedInUser?.userName}</h6>
            <textarea className='form-control border-0 shadow-none text-light'  style={{
            backgroundColor: "#2a2a2a",
            borderRadius: "15px",
            resize: "none"
            }} 
            value={commentContent}
            onChange={(e) => {setCommentContent(e.target.value)}} rows={2} placeholder='Add a comment...' ></textarea>
            <div className="mt-2 text-end">
              <button className="btn btn-sm btn-secondary" onClick={() => {setCommentContent(""), setIsEditingCommentId(null)}}>Cancel</button>
              <button className="btn btn-primary btn-sm ms-2 px-3 rounded-pill" onClick={handleOnCommentBtn} >{isEditingCommentId ? "Update" : "Comment"}</button>
            </div>
        </div>
      </div>
      
      {!postId && numberOfComments && (
      <div className="mt-2 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <nav aria-label="Page navigation">
        <ul className="pagination pagination-sm mb-0">
          <li className="page-item">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="page-link"
            >
              &laquo;
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <li key={pageNumber} className={`page-item ${pageNumber === page ? "active" : ""}`}>
                <button className="page-link link-dark" onClick={() => setPage(pageNumber)}>
                  {pageNumber}
                </button>
              </li>
            );
          })}
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              &raquo;
            </button>
          </li>
        </ul>
        </nav>

        <div className="btn-group btn-group-sm" role="group" aria-label="Sort order">
          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" value="newest"
            autoComplete="off" checked={sortBy === "newest"} onChange={handleSortBy} />
          <label className="btn btn-outline-secondary" htmlFor="btnradio1">Newest</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" value="oldest" autoComplete="off"
            checked={sortBy === "oldest"} onChange={handleSortBy} />
          <label className="btn btn-outline-secondary" htmlFor="btnradio2">Oldest</label>
        </div>
      </div> )}
    </div>

    {/* Static comment list */}
    <div className="mt-3 ms-3">
      {commentList && (
       commentList?.map((comment) => (
        <div className="d-flex gap-3 p-3 mb-3 rounded-4" key={comment._id} style={{ backgroundColor: "#1f1f1f",
          border: "1px solid #2f2f2f" }}>
          <img src={comment?.owner?.avatar} alt="User" className="rounded-circle flex-shrink-0"
          width={45} height={45}
          style={{
          objectFit: "cover"
          }} />
          <div>
            <h6 className="mb-1 fw-semibold text-light">{comment?.owner?.userName}<small className="ms-2"
              style={{ fontSize: "12px", color: "#9e9e9e" }}>
                {formatTimeFromNow(comment?.createdAt)}
                </small>
            </h6>
            <p className="mb-0 text-white">{comment?.content}</p>
            <button
              onClick={() => {handleOnLikeComment(comment._id)}}
              className="btn rounded-circle gap-1 p-1 px-2"
              style={{ color: 'white' }} >
              {(comment?.isLiked) ? <AiFillLike size={18} /> :  <AiOutlineLike size={18} /> }
              </button>
              <span >{ comment?.likesCount || 0}</span>
          </div>
          <div className="dropdown ms-5">
            <button
              className="btn btn-dark rounded-pill d-flex align-items-center gap-2 px-3 py-1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ backgroundColor: "#2a2a2a", border: "none" }}  >
              <BsThreeDotsVertical size={18} color="white" />
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              <li>
                <button className="dropdown-item text-light" type='button' onClick={() => handleOnCommentEditBtn(comment?._id, comment?.content)}>
                  Update
                </button>
              </li>
              <li>
                <button className="dropdown-item text-danger" type='button' onClick={() => handleOnCommentDeleteBtn(comment?._id)}>
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      )))}
    </div>
  </div>
</div>
  )
}

export default CommentSection;