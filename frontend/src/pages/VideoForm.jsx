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

      setFormData({ title: "", description: "", isPublished: true });

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
      <div
        className="card border-0 mx-auto"
        style={{
          maxWidth: "1400px",
          background: "#181818",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,.35)",
        }} >
        <div className="p-4 border-bottom border-secondary">
          <h2 className="fw-bold text-white mb-1">
            {videoId ? "Update Video" : "Upload Video"}
          </h2>

          <p className="text-secondary mb-0">
            Upload and manage your content
          </p>
        </div>

        <div className="row g-4 p-4">
          {/* LEFT SIDE */}
          <div className="col-lg-8">
            {!videoId && (
              <div className="p-4 rounded-4 mb-4"
                style={{
                  background: "#202020",
                  border: "1px solid #303030",
                }} >
                <h5 className="text-white mb-3"> Video Upload </h5>

                <label style={{cursor: "pointer"}} className="d-block text-center p-5 rounded-4 border border-info" >
                  <div style={{ fontSize: "70px" }} > 🎬 </div>

                  <h5 className="text-white mt-3"> Upload Video </h5>

                  <p className="text-secondary"> Click to select a video </p>

                  <input hidden type="file" accept="video/*" ref={videoFileRef} onChange={handleVideoChange} />
                </label>

                {videoPreview && (
                  <div className="mt-4">
                    <video controls width="100%"
                      style={{
                        borderRadius: "16px",
                        maxHeight: "500px",
                      }}
                    >
                      <source src={videoPreview} />
                    </video>

                    <div className="mt-2 text-secondary"> {videoName} </div>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 rounded-4"
              style={{
                background: "#202020",
                border: "1px solid #303030",
              }}
            >
              <div className="mb-4">
                <label className="form-label text-white"> Video Title </label>

                <input type="text" className="form-control" name="title" value={formData.title}
                  onChange={handleOnChange} placeholder="Add a title"
                  style={{
                    background: "#121212",
                    border: "1px solid #303030",
                    color: "white",
                    height: "60px",
                    borderRadius: "14px",
                  }}
                />
              </div>

              <div>
                <label className="form-label text-white"> Description </label>

                <textarea className="form-control" name="description" value={formData.description}
                  onChange={handleOnChange} placeholder="Tell viewers about your video"
                  style={{
                    background: "#121212",
                    border: "1px solid #303030",
                    color: "white",
                    minHeight: "220px",
                    borderRadius: "14px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4">
            <div className="p-4 rounded-4 mb-4"
              style={{
                background: "#202020",
                border: "1px solid #303030",
              }} >
              <h5 className="text-white mb-3"> Thumbnail </h5>

              <label className="d-block text-center p-4 rounded-4 border border-info"
                style={{ cursor: "pointer" }} >
                <div style={{ fontSize: "50px" }}> 🖼️ </div>

                <div className="text-white mt-2">
                  Upload Thumbnail
                </div>

                <input hidden type="file" accept="image/*" ref={thumbnailRef} onChange={handleThumbnailChange}/>
              </label>

              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Thumbnail" className="w-100 mt-3"
                  style={{
                    borderRadius: "14px",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>

            <div className="p-4 rounded-4 mb-4"
              style={{
                background: "#202020",
                border: "1px solid #303030",
              }} >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white mb-1"> Visibility </h6>

                  <small className="text-secondary"> Publish immediately </small>
                </div>

                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isPublished: e.target.checked,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn w-100 fw-bold py-3"
              style={{
                background: "#3ea6ff",
                border: "none",
                color: "#fff",
                borderRadius: "14px",
                fontSize: "16px",
              }} >
              {loading
                ? "Processing..."
                : videoId
                ? "Update Video"
                : "Upload Video"}
            </button>
          </div>
        </div>
      </div>
     <ManageAction error={error} successMsg={successMsg} loading={loading} />
    </div>
  );
}

export default VideoForm;