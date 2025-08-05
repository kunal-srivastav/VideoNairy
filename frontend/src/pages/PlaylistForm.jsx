import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { createPlaylist, updatePlaylist } from '../features/playlists/playlistThunk';
import { setError } from '../features/users/userSlice';
import ManageAction from '../components/ManageAction';

function PlaylistForm() {

    const navigate = useNavigate();
    const { playlistId } = useParams();
    const playlistImageRef = useRef(null);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");

    const dispatch = useDispatch();
    const { loading, error, successMsg } = useSelector(state => state.playlists);
    const { user } = useSelector(state => state.users);

    function resetForm () {
      setPlaylistName("");
      setPlaylistDescription("");
      if(playlistImageRef.current) {
        playlistImageRef.current.value = null;
      }
    }

    const handleOnSubmit = async (e) => {
      e.preventDefault();

      const userPlaylist = new FormData();
      userPlaylist.append("name", playlistName);
      userPlaylist.append("description", playlistDescription);
      const imageFile = playlistImageRef.current.files[0];
      if (imageFile) { userPlaylist.append("playlistImage", imageFile); }
      try {
        if (playlistId) {
          await dispatch(updatePlaylist({playlistId, userPlaylist})).unwrap();
          resetForm();
          setTimeout(() => navigate(`/users/profile/${user?.userName}/playlists`), 2000);
        } else {
          await dispatch(createPlaylist(userPlaylist)).unwrap();
          resetForm();
          setTimeout(() => navigate(`/users/profile/${user?.userName}/playlists`), 2000);
        }
      } catch (err) {
        dispatch(setError(err?.message || "Something went wrong"));
      }
    };

  return (
    <div className="d-flex justify-content-center mt-4">
    <form onSubmit={handleOnSubmit} className="p-4 p-md-5 border rounded-3 bg-body-tertiary">
        <div className="input-group mb-3">
            <input type="file" accept='image/*' className="form-control" ref={playlistImageRef} name="playlistImage" id="inputGroupFile02" />
        </div>
        <div className="form-floating mb-3">
            <input type="text" className="form-control" value={playlistName} onChange={(e) => {setPlaylistName(e.target.value)}} name="name" id="floatingText" placeholder="fullname" />
            <label htmlFor="floatingText">Name</label>
          </div>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" value={playlistDescription} onChange={(e) => {setPlaylistDescription(e.target.value)}} name="description" id="floatingText2" placeholder="Username" />
            <label htmlFor="floatingText2">Description</label>
          </div>
          <button className="w-100 btn mt-2 btn-lg btn-primary" type="submit">{playlistId? "Update": "Create"}</button>
          <ManageAction error={error} successMsg={successMsg} loading={loading} />
        </form>
    </div>
  )
}

export default PlaylistForm;