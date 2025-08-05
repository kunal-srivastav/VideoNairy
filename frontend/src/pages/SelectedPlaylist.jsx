import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {setError} from "../features/users/userSlice";
import { addVideoInPlaylist, removeVideoInPlaylist } from '../features/playlists/playlistThunk';

function SelectedPlaylist({ videoId, onClose }) {

  const { playlists } = useSelector(state => state.playlists);
  const dispatch = useDispatch();
  const [playlistStatus, setPlaylistStatus] = useState({});

  // Initialize local state from Redux playlists
  useEffect(() => {
    if (playlists) {
      const status = {};
      playlists.forEach(p => {
        status[p._id] = p.videos.includes(videoId);
      });
      setPlaylistStatus(status);
    }
  }, [playlists, videoId]);

  const handleAdd = async (playlistId, isAlreadyInPlaylist) => {
    try {
      if (isAlreadyInPlaylist) {
      await dispatch(removeVideoInPlaylist({ playlistId, videoId })).unwrap();
    } else {
      await dispatch(addVideoInPlaylist({ playlistId, videoId })).unwrap();
    }
      onClose(); // Close the modal after adding
    } catch (err) {
      dispatch(setError(err?.message || "Failed to update playlist"));
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-75">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-light">
          <div className="modal-header">
            <h5 className="modal-title">Add to Playlist</h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {!playlists && playlists?.length === 0 ? (
              <p>No playlists available.</p>
            ) : (
              <ul className="list-group">
                {playlists.map((playlist) => {
                  const isInPlaylist = playlistStatus[playlist._id] || false;

                return (
                  <li key={playlist._id} className="list-group-item d-flex justify-content-between align-items-center">
                    {playlist.name}
                    <button
                      className={`btn btn-sm ${isInPlaylist ? "btn-outline-danger" : "btn-outline-primary px-3"}`}
                      onClick={() => handleAdd(playlist._id, isInPlaylist)} >
                      {isInPlaylist ? "Remove" : "Add"}
                    </button>
                  </li>
                );
              })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedPlaylist;
