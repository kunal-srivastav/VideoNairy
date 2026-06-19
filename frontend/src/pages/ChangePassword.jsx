import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setError } from "../features/users/userSlice";
import { changePassword } from "../features/users/userThunks";
import { useDispatch, useSelector } from "react-redux";
import ManageAction from "../components/ManageAction";

function ChangePassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const dispatch = useDispatch();

  const { error, successMsg, loading } = useSelector(
    (state) => state.users
  );

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      return dispatch(setError("Both fields are required."));
    }

    if (oldPassword === newPassword) {
      return dispatch(setError("New password must be different."));
    }

    const passwordData = { oldPassword, newPassword };

    try {
      await dispatch(changePassword(passwordData)).unwrap();

      setOldPassword("");
      setNewPassword("");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      dispatch(setError(err.message) || "Password unchanged");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "20px",
          background: "#212121",
        }}
      >
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-white mb-2">
              Change Password
            </h2>

            <p className="text-secondary mb-0">
              Keep your account secure
            </p>
          </div>

          <form onSubmit={handleOnSubmit}>
            <div className="form-floating mb-3">
              <input type="password" className="form-control bg-dark text-light border-secondary"
                name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                id="oldPassword" minLength={4} maxLength={8} placeholder="Old Password" />
              <label htmlFor="oldPassword">
                Old Password
              </label>
            </div>

            <div className="form-floating mb-4">
              <input type="password" className="form-control bg-dark text-light border-secondary"
                name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                id="newPassword" minLength={4} maxLength={8} placeholder="New Password" />
              <label htmlFor="newPassword">
                New Password
              </label>
            </div>

            <button className="btn btn-primary w-100 py-2 fw-semibold rounded-pill" type="submit"
              disabled={loading} >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" ></span>
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>

          <ManageAction error={error} successMsg={successMsg} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;