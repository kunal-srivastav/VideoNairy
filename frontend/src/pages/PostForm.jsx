import { useRef, useState } from "react";
import { LuUpload } from "../assets/Icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setError } from "../features/users/userSlice";
import { createPost, updatePost } from "../features/posts/postThunks";

const PostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.users);
  const { loading, error, successMsg } = useSelector(
    (state) => state.posts
  );

  function resetFormWithNavigate() {
    setImage(null);
    setFile(null);

    setTimeout(() => {
      navigate(`/users/profile/${user?.userName}/posts`);
    }, 2000);
  }

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (
      selectedFile &&
      selectedFile.type.startsWith("image/")
    ) {
      setFile(selectedFile);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setImage(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleOnPost = async () => {
    if (!file) {
      dispatch(
        setError("Please select an image first.")
      );
      return;
    }

    const postData = new FormData();

    postData.append("postImage", file);

    try {
      if (postId) {
        await dispatch(
          updatePost({
            postId,
            postData,
          })
        ).unwrap();

        resetFormWithNavigate();
      } else {
        await dispatch(
          createPost(postData)
        ).unwrap();

        resetFormWithNavigate();
      }
    } catch (err) {
      dispatch(
        setError(
          err?.response?.data?.message ||
            "Something went wrong!"
        )
      );
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "850px" }} >
      <div className="card border-0 shadow-lg"
        style={{
          backgroundColor: "#1f1f1f",
          borderRadius: "24px",
        }}
      >
        <div className="card-body p-4 p-md-5">

          <h2 className="text-center text-light fw-bold mb-4">
            {postId
              ? "Update Post"
              : "Create New Post"}
          </h2>

          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange}
            style={{ display: "none" }} />

          {!image ? (
            <div onClick={handleUploadClick}
              className="d-flex flex-column justify-content-center align-items-center text-center"
              style={{
                border: "2px dashed #444",
                borderRadius: "20px",
                minHeight: "350px",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              <div
                style={{
                  fontSize: "60px",
                }}
              >
                📸
              </div>

              <h4 className="text-light mt-3">
                Upload Your Image
              </h4>

              <p className="text-secondary">
                Click here or drag and drop
                an image
              </p>

              <button type="button" className="btn btn-primary rounded-pill px-4 mt-2" >
                <LuUpload className="me-2" />
                Choose File
              </button>
            </div>
          ) : (
            <>
              <div className="position-relative">

                <img src={image} alt="Preview" className="img-fluid rounded-4 w-100 shadow"
                  style={{
                    maxHeight: "600px",
                    objectFit: "cover",
                  }}
                />

                <button type="button" className="btn btn-danger rounded-circle position-absolute"
                  style={{
                    top: "15px",
                    right: "15px",
                    width: "40px",
                    height: "40px",
                  }}
                  onClick={() => {
                    setImage(null);
                    setFile(null);
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="d-flex justify-content-between mt-4">

                <button type="button" className="btn btn-outline-light rounded-pill px-4"
                  onClick={handleUploadClick} >
                  Change Image
                </button>

                <button type="button" className="btn btn-warning rounded-pill px-5 fw-semibold"
                  onClick={handleOnPost} disabled={loading} >
                  {loading
                    ? "Processing..."
                    : postId
                    ? "Update Post"
                    : "Create Post"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default PostForm;