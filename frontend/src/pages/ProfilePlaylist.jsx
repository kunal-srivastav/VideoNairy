import styles from "./channel.module.css";
import { BsThreeDotsVertical, MdOutlinePlaylistPlay, AiOutlineDelete, AiOutlineEdit  } from '../assets/Icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../features/users/userSlice';
import "../App.css";
import { deletePlaylist } from "../features/playlists/playlistThunk";
import { formatTimeFromNow } from "../features/utils/formatTimeFromNow";

function ProfilePlaylist() {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loggedInUser } = useSelector(state => state.users);
    const { playlists } = useSelector(state => state.playlists);

    const handleOnPlaylistDelete = async (playlistId) => {
      try {
          await dispatch(deletePlaylist(playlistId)).unwrap();
      } catch (err) {
          dispatch(setError((err?.message || "Something went wrong!")));
      }
    };

    const handlePlayAll = (e, playlist) => {
      e.stopPropagation();
      navigate(`/playlists/play/${playlist._id}`)
    }

  return (
    <div className="album py-2">
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-5"> 

        {/* Profile Playlists */}
        { playlists?.length > 0  ? (
        playlists?.map((playlist) => (
        <div className="col" key={playlist._id}>
          <div
            className="card bg-transparent text-light text-decoration-none playlist-card"
            style={{ minWidth: '350px', maxWidth: '400px', border: 'none' }}
          >
            <div className="position-relative">
              <img
                src={playlist?.playlistImage}
                alt="Playlist Image"
                className="card-img-top"
                style={{ height: '180px', objectFit: 'cover' }}
              />
              <small className="bg-dark position-absolute bottom-0 end-0" style={{ fontSize: 'small' }}>
                <MdOutlinePlaylistPlay size={18} />{playlist.videos.length} videos
              </small>
              {/* Play All Overlay */}
              <div className="play-overlay d-flex justify-content-center align-items-center">
                <button className="btn btn-light fw-bold px-3 py-1 rounded-pill" onClick={(e) => {handlePlayAll(e, playlist)}} >▶ Play All</button>
              </div>
            </div>

            <div className="card-body px-0">
              <div className="d-flex align-items-start justify-content-between">
                <h5 className={`${styles.multiLineTruncate} mb-0 fw-bold`} style={{ maxWidth: '260px' }}>
                  {playlist.name}
                </h5>
                {playlist?.creator === loggedInUser?._id && (
                  <div className="dropdown">
                    <button
                      type="button"
                      className="flex-shrink-0 btn p-1 rounded-circle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ width: '30px', height: '30px' }}
                    >
                      <BsThreeDotsVertical color="white" />
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to={`/playlists/update-playlist/${playlist._id}`}>
                          <AiOutlineEdit className="me-1" /> Update
                        </Link>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleOnPlaylistDelete(playlist._id)}>
                          <AiOutlineDelete className="me-1" /> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <p>Updated {formatTimeFromNow(playlist.updatedAt)}</p>
            </div>
          </div>
      </div>

        ))
    ) : (
        <div className="col text-center">
            <h5 className="text-light">No playlists found</h5>
        </div>
    )} 
        </div>
      </div>
    </div>
  )
}

export default ProfilePlaylist;