import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateVideo, videoUpload } from "../features/videos/videoThunks";
import { setError } from "../features/users/userSlice";
import ManageAction from "../components/ManageAction";

function VideoForm() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const thumbnailRef = useRef(null);
  const videoFileRef = useRef(null);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoName, setVideoName] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublished: true,
  });

  const { error, successMsg, loading } = useSelector(
    (state) => state.videos
  );

  const { user } = useSelector((state) => state.users);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setVideoPreview(URL.createObjectURL(file));
    setVideoName(file.name);
  };

  const handleOnVideo = async (e) => {
    e.preventDefault();

    const videoData = new FormData();

    if (thumbnailRef.current?.files[0]) {
      videoData.append(
        "thumbnail",
        thumbnailRef.current.files[0]
      );
    }

    if (!videoId && videoFileRef.current?.files[0]) {
      videoData.append(
        "videoFile",
        videoFileRef.current.files[0]
      );
    }

    videoData.append("title", formData.title);
    videoData.append("description", formData.description);
    videoData.append("isPublished", formData.isPublished);

    try {
      if (videoId) {
        await dispatch(
          updateVideo({
            videoData,
            videoId,
          })
        ).unwrap();
      } else {
        await dispatch(videoUpload(videoData)).unwrap();
      }

      setFormData({
        title: "",
        description: "",
        isPublished: true,
      });

      setThumbnailPreview(null);
      setVideoPreview(null);
      setVideoName("");

      if (thumbnailRef.current)
        thumbnailRef.current.value = null;

      if (videoFileRef.current)
        videoFileRef.current.value = null;

      setTimeout(() => {
        navigate(`/users/profile/${user?.userName}`);
      }, 2000);
    } catch (err) {
      dispatch(setError(err?.message || "Video not uploaded"));
    }
  };

  return (
    <div className="container py-5">
      <div className="card bg-dark text-light border-0 shadow-lg mx-auto"
        style={{
          maxWidth: "900px",
          borderRadius: "20px",
        }}
      >
        <div className="card-body p-4 p-md-5">
          <h2 className="fw-bold text-center mb-4">
            {videoId ? "Update Video" : "Upload Video"}
          </h2>

          <form onSubmit={handleOnVideo}>
            {/* Thumbnail */}

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Thumbnail
              </label>

              <input type="file" accept="image/*" ref={thumbnailRef} className="form-control"
                onChange={handleThumbnailChange} />

              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Thumbnail Preview" className="img-fluid rounded mt-3"
                  style={{
                    maxHeight: "250px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            {/* Video */}

            {!videoId && (
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Video File
                </label>

                <input type="file" accept="video/*" ref={videoFileRef} className="form-control"
                  onChange={handleVideoChange} />

                {videoPreview && (
                  <div className="mt-3">
                    <video controls width="100%"
                      style={{
                        maxHeight: "350px",
                        borderRadius: "12px",
                      }}
                    >
                      <source src={videoPreview} />
                    </video>

                    <p className="text-secondary mt-2 mb-0">
                      {videoName}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Title */}

            <div className="form-floating mb-3">
              <input type="text" className="form-control bg-secondary border-0 text-white"
                name="title" value={formData.title} onChange={handleOnChange} placeholder="Title" />
              <label>Video Title</label>
            </div>

            {/* Description */}

            <div className="form-floating mb-4">
              <textarea className="form-control bg-secondary border-0 text-white"
                style={{ height: "140px" }} name="description" value={formData.description}
                onChange={handleOnChange} placeholder="Description" />
              <label>Description</label>
            </div>

            {/* Publish */}

            <div className="form-check form-switch mb-4">
              <input className="form-check-input" type="checkbox" checked={formData.isPublished}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublished: e.target.checked,
                  }))
                }
              />

              <label className="form-check-label">
                Publish Immediately
              </label>
            </div>

            {/* Submit */}

            <button type="submit" disabled={loading} className="btn btn-danger w-100 py-3 fw-bold" >
              {loading
                ? "Processing..."
                : videoId
                ? "Update Video"
                : "Upload Video"}
            </button>
          </form>
        </div>
      </div>
     <ManageAction error={error} successMsg={successMsg} loading={loading} />
    </div>
  );
}

export default VideoForm;