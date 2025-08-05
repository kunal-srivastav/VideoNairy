import { useRef, useState } from 'react';
import { LuUpload } from "../assets/Icons";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setError } from '../features/users/userSlice';
import { createPost, updatePost } from '../features/posts/postThunks';
import ManageAction from '../components/ManageAction';

const PostForm = () => {

  const { postId } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null); // preview
  const [file, setFile] = useState(null);   // actual file

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.users);
  const { loading, error, successMsg } = useSelector(state => state.posts);

  function resetFormWithNavigate () {
    setImage(null);
    setFile(null);
    setTimeout(() => {
      navigate(`/users/profile/${user?.userName}/posts`);
    }, 2000);
  }

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // base64 for preview only
      };
      reader.readAsDataURL(selectedFile); // Read file as Base64 string
    } else {
      setFile(null);  // If not an image, clear file and preview
      setImage(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleOnPost = async () => {

    if (!file) {
      dispatch(setError("Please select an image first."));
      return;
    }    
    const postData = new FormData();
    postData.append('postImage', file); // ✅ This time we use the real file

    try {
      if(postId) {
        await dispatch(updatePost({postId, postData})).unwrap();
        resetFormWithNavigate();
      } else {
        await dispatch(createPost(postData)).unwrap();
        resetFormWithNavigate();
      }
    } catch (err) {
      dispatch(setError(err?.response?.data?.message || "Something went wrong!"));
    }
  };

  return (
    <div className="d-flex flex-column align-items-center text-light py-4">
      <h3 className="mb-4">{postId? "Update Post" : "Create Post"}</h3>

      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange}
        style={{ display: 'none' }} />

      <button className="btn btn-primary" onClick={handleUploadClick}>
        <LuUpload className='me-2 mb-1' />
        Upload Image
      </button>

      {image && (
        <div className='position-relative d-inline-block'>
          <div className="mt-4">
            <img
              src={image}
              alt="Preview"
              className="img img-fluid rounded shadow"
              style={{ maxWidth: '600px', minHeight: "300px" }}
            />
          </div>
          <button
            type="button"
            className="position-absolute mt-4 top-0 start-100 translate-middle btn-close"
            style={{ backgroundColor: 'white' }}
            aria-label="Remove"
            onClick={() => {
              setImage(null);
              setFile(null);
            }} />
            <button type='submit' className="btn btn-warning mt-2 float-end" onClick={handleOnPost} disabled={loading}>
              {postId ? "Update" : "Create"}
            </button>
        </div>
      )}
        <ManageAction error={error} successMsg={successMsg} loading={loading} />
    </div>
  );
};

export default PostForm;
