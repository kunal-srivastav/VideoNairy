import  { useEffect } from 'react'
import { clearMsg } from '../features/users/userSlice';
import { useDispatch } from 'react-redux';

function ManageAction({error, successMsg, loading}) {

  const dispatch = useDispatch();

  useEffect(() => {
    if(error || successMsg){
    setTimeout(() => {
      dispatch(clearMsg());
    }, 5000);
    }
  }, [error, successMsg]);

  return (
    <div className="d-flex justify-content-center mt-5">
    { error && (
      <div className="alert alert-danger position-fixed top-0 ms-5" role="alert">
        {error}
      </div>
    )}

    { successMsg && (
    <div className="alert alert-success position-fixed top-0 ms-5" role="alert">
        {successMsg}
    </div>
    )}

    { loading && (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1055 }}>
        <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
        </div>
    </div>
    )}
    </div>
  )
}

export default ManageAction