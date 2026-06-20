import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createPlaylist, updatePlaylist } from "../features/playlists/playlistThunk";
import { setError } from "../features/users/userSlice";
import ManageAction from "../components/ManageAction";

function PlaylistForm() {
  const navigate = useNavigate();
  const { playlistId } = useParams();

  const playlistImageRef = useRef(null);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const dispatch = useDispatch();

  const { loading, error, successMsg } = useSelector(
    (state) => state.playlists
  );

  const { user } = useSelector((state) => state.users);

  const resetForm = () => {
    setPlaylistName("");
    setPlaylistDescription("");
    setPreviewImage(null);

    if (playlistImageRef.current) {
      playlistImageRef.current.value = null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const userPlaylist = new FormData();

    userPlaylist.append("name", playlistName);
    userPlaylist.append("description", playlistDescription);

    const imageFile = playlistImageRef.current.files[0];

    if (imageFile) {
      userPlaylist.append("playlistImage", imageFile);
    }

    try {
      if (playlistId) {
        await dispatch(
          updatePlaylist({
            playlistId,
            userPlaylist,
          })
        ).unwrap();

        resetForm();

        setTimeout(() => {
          navigate(`/users/profile/${user?.userName}/playlists`);
        }, 2000);
      } else {
        await dispatch(createPlaylist(userPlaylist)).unwrap();

        resetForm();

        setTimeout(() => {
          navigate(`/users/profile/${user?.userName}/playlists`);
        }, 2000);
      }
    } catch (err) {
      dispatch(setError(err?.message || "Something went wrong"));
    }
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-lg mx-auto bg-dark text-light"
        style={{
          maxWidth: "700px",
          borderRadius: "20px",
        }}
      >
        <div className="card-body p-4 p-md-5">
          <h2 className="fw-bold text-center mb-4">
            {playlistId ? "Update Playlist" : "Create Playlist"}
          </h2>

          <form onSubmit={handleOnSubmit}>
            {/* Image Upload */}

            <div className="mb-4">
              <input type="file" accept="image/*" ref={playlistImageRef} onChange={handleImageChange}
                className="form-control" />
            </div>

            {/* Preview */}

            {previewImage && (
              <div className="text-center mb-4">
                <img src={previewImage} alt="Preview" className="img-fluid rounded shadow"
                  style={{
                    maxHeight: "250px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* Playlist Name */}

            <div className="form-floating mb-3">
              <input type="text" className="form-control bg-secondary border-0 text-white"
                placeholder="Playlist Name" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} />
              <label>Playlist Name</label>
            </div>

            {/* Playlist Description */}

            <div className="form-floating mb-4">
              <textarea className="form-control bg-secondary border-0 text-white"
                placeholder="Description" style={{ height: "120px" }} value={playlistDescription}
                onChange={(e) =>
                  setPlaylistDescription(e.target.value)
                }
              />
              <label>Description</label>
            </div>

            {/* Button */}

            <button type="submit" disabled={loading} className="btn btn-danger w-100 py-3 fw-bold" >
              {loading
                ? "Please wait..."
                : playlistId
                ? "Update Playlist"
                : "Create Playlist"}
            </button>
          </form>
        </div>
      </div>
      <ManageAction error={error} successMsg={successMsg} loading={loading} />
    </div>
  );
}

export default PlaylistForm;