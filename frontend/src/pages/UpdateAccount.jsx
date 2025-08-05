import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../features/users/userSlice';
import { updateAccountDetails } from '../features/users/userThunks';
import { useNavigate } from 'react-router-dom';
import ManageAction from '../components/ManageAction';

function UpdateAccount() {

    const [formData, setFormData] = useState({fullName: "", userName: "", email: ""});
    const dispatch = useDispatch();
    const { error, successMsg, loading, user } = useSelector(state => state.users);
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        setFormData({
          fullName: user.fullName || "",
          userName: user.userName || "",
          email: user.email || ""
        });
      }
    }, [user]);


    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleOnSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await dispatch(updateAccountDetails(formData)).unwrap();
        const { userName } = res.updatedUser
        setFormData({fullName: "", userName: "", email: ""});
        setTimeout(() => {
          navigate(`/users/profile/${userName}`);
        }, 3000);
      } catch (err) {
        dispatch(setError(err || "Account detail doesn't update"));
      }
    };

  return (
    <div className="d-flex justify-content-center mt-4">
    <form onSubmit={handleOnSubmit} className="p-3 p-md-5 border rounded-3 bg-body-tertiary">
        <div className="form-floating mb-3">
            <input type="text" className="form-control" value={formData.fullName} onChange={handleOnChange} name="fullName" id="floatingText" placeholder="fullname" />
            <label htmlFor="floatingText">Fullname</label>
          </div>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" value={formData.userName} onChange={handleOnChange} name="userName" id="floatingText2" placeholder="Username" />
            <label htmlFor="floatingText2">Username</label>
          </div>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" value={formData.email} onChange={handleOnChange} name='email' id="floatingInput" placeholder="name@example.com" />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <button className="w-100 btn mt-2 btn-lg btn-primary" type="submit">Update</button>
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

          {loading && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1055 }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
    </form>
    <ManageAction error={error} successMsg={successMsg} loading={loading} />
    </div>
  )
}

export default UpdateAccount