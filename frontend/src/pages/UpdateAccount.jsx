import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../features/users/userSlice";
import { updateAccountDetails } from "../features/users/userThunks";
import { useNavigate } from "react-router-dom";
import ManageAction from "../components/ManageAction";

function UpdateAccount() {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, successMsg, loading, user } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        userName: user.userName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(
        updateAccountDetails(formData)
      ).unwrap();

      const { userName } = res.updatedUser;

      setTimeout(() => {
        navigate(`/users/profile/${userName}`);
      }, 2000);
    } catch (err) {
      dispatch(
        setError(
          err?.message || "Account details could not be updated."
        )
      );
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }} >
      <div className="w-100"
        style={{
          maxWidth: "650px",
        }} >
        <div className="p-4 p-md-5"
          style={{
            background: "#181818",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          <div className="text-center mb-4">
            <h2 className="text-white fw-bold">
              Update Account
            </h2>
            <p className="text-secondary mb-0">
              Manage your profile information
            </p>
          </div>

          <form onSubmit={handleOnSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <label className="form-label text-light">
                Full Name
              </label>

              <input type="text" className="form-control" name="fullName" value={formData.fullName}
                onChange={handleOnChange} placeholder="Enter full name"
                style={{
                  background: "#242424",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              />
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="form-label text-light">
                Username
              </label>

              <input type="text" className="form-control" name="userName" value={formData.userName}
                onChange={handleOnChange} placeholder="Enter username"
                style={{
                  background: "#242424",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="form-label text-light">
                Email Address
              </label>

              <input type="email" className="form-control" name="email"
                value={formData.email} onChange={handleOnChange} placeholder="name@example.com"
                style={{
                  background: "#242424",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn w-100 fw-bold"
              style={{
                background: "#ff0000",
                color: "#fff",
                borderRadius: "50px",
                padding: "12px",
                border: "none",
                fontSize: "16px",
              }} >
              {loading ? "Updating..." : "Update Account"}
            </button>
          </form>
        </div>

        <ManageAction error={error} successMsg={successMsg} loading={loading} />
      </div>
    </div>
  );
}

export default UpdateAccount;