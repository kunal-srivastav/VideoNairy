import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { setError } from '../features/users/userSlice';
import { changePassword } from '../features/users/userThunks';
import { useDispatch, useSelector } from 'react-redux';
import ManageAction from '../components/ManageAction';

function ChangePassword() {

const navigate = useNavigate();
const [ oldPassword, setOldPassword ] = useState("");
const [ newPassword, setNewPassword ] = useState("");
const dispatch = useDispatch();
const { error, successMsg, loading } = useSelector((state) => state.users);


const handleOnSubmit = async (e) => {
  e.preventDefault();

  // Check if fields are empty
  if (!oldPassword || !newPassword) {
    return dispatch(setError("Both fields are required."))
  }
  if (oldPassword === newPassword) {
    return dispatch(setError("New password must be different."));
  }

  const passwordData = {oldPassword, newPassword};
    try {
      await dispatch(changePassword(passwordData)).unwrap();
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => {
        navigate("/"); // Redirect after 3 seconds
      }, 3000);
    } catch (err) {
      dispatch(setError(err.message) || "Password unchanged");
    } 
  };

return (

<div className="d-flex justify-content-center align-items-center flex-column" style={{"height": "100vh"}}>
    <h1 className="text-center text-light">Change Password</h1>
  <form onSubmit={handleOnSubmit} className="p-md-5 border rounded-3 bg-body-tertiary">
      <div className="form-floating mb-3">
        <input type="password" className="form-control" name="oldPassword" value={oldPassword} onChange={(e) => {setOldPassword(e.target.value)}} id="floatingInput" minLength={4} maxLength={8} placeholder="Old Password" />
        <label htmlFor="floatingInput">Old Password</label>
      </div>
      <div className="form-floating mb-3">
        <input type="password" className="form-control" name="newPassword" value={newPassword} onChange={(e) => {setNewPassword(e.target.value)}} id="floatingPassword" minLength={4} maxLength={8} placeholder="New Password" />
        <label htmlFor="floatingPassword">New Password</label>
      </div>
      <button className="w-75 btn btn-sm btn-primary" type="submit" disabled={loading}>Change password</button>
    <ManageAction error={error} successMsg={successMsg} loading={loading} />
  </form>
</div>
  )
}

export default ChangePassword