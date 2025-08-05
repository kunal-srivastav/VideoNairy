import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { updateVideo, videoUpload } from '../features/videos/videoThunks';
import { setError } from '../features/users/userSlice';
import ManageAction from '../components/ManageAction';

function VideoForm() {

  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const thumbnailRef = useRef(null);
  const videoFileRef = useRef(null);

  const [ formData, setFormData ] = useState({title: "", description: "", isPublished: true});
  const { error, successMsg, loading } = useSelector(state => state.videos);
  const { user } = useSelector(state => state.users);

  const handleOnChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
          ...prev, [name]: value
      }))
  };

const handleOnVideo = async (e) => {
  e.preventDefault();

  const videoData = new FormData();

  if (thumbnailRef.current?.files[0]) {
    videoData.append("thumbnail", thumbnailRef.current.files[0]);
  }

  if (!videoId && videoFileRef.current?.files[0]) {
    videoData.append("videoFile", videoFileRef.current.files[0]);
  }

  videoData.append("title", formData.title);
  videoData.append("description", formData.description);
  videoData.append("isPublished", formData.isPublished);

  try {
    if (videoId) {
      await dispatch(updateVideo({ videoData, videoId })).unwrap();
    } else {
      await dispatch(videoUpload(videoData)).unwrap();
    }

    setFormData({ title: "", description: "", isPublished: true });
    if (thumbnailRef.current) thumbnailRef.current.value = null;
    if (videoFileRef.current) videoFileRef.current.value = null;

    setTimeout(() => {
        navigate(`/users/profile/${user?.userName}`);
    }, 2000)
  } catch (err) {
    dispatch(setError(err?.message || "Video not uploaded"));
  }
};

  return (
    <div className="d-flex justify-content-center mt-4">
        <form onSubmit={handleOnVideo} className="p-4 p-md-5 border rounded-3 bg-body-tertiary">
            <div className="input-group mb-3">
                <input type="file" accept='image/*' className="form-control" ref={thumbnailRef} name="thumbnail" id="inputGroupFile01" />
            </div>
            {!videoId && (
                <div className="input-group mb-3">
                    <input type="file" className="form-control" ref={videoFileRef} name="coverImage" id="inputGroupFile02" />
                </div>
            )}
            <div className="form-floating mb-3">
                <input type="text" className="form-control" value={formData.title} onChange={handleOnChange} name="title" id="floatingText" placeholder="title" />
                <label htmlFor="floatingText">Title</label>
            </div>
            <div className="form-floating mb-3">
                <textarea type="text" className="form-control" value={formData.description} onChange={handleOnChange} name="description" id="floatingText2" placeholder="description" />
                <label htmlFor="floatingText2">Description</label>
            </div>
            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    id="isPublishedCheckbox"
                />
                <label className="form-check-label" htmlFor="isPublishedCheckbox">
                    Publish Now
                </label>
            </div>

            <button className="w-100 btn mt-2 btn-lg btn-primary" disabled={loading} type="submit">{videoId? "Update" : "Create"}</button>
            <ManageAction error={error} successMsg={successMsg} loading={loading} />
        </form>
    </div>
  )
}

export default VideoForm;