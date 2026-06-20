import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setError } from "../features/users/userSlice";
import { createAccount, currentUser } from "../features/users/userThunks";
import ManageAction from "../components/ManageAction";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const avatarRef = useRef(null);
  const coverImageRef = useRef(null);

  const dispatch = useDispatch();

  const { loading, error, successMsg } = useSelector(
    (state) => state.users
  );

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const registerData = new FormData();

    registerData.append(
      "avatar",
      avatarRef.current.files[0]
    );

    registerData.append(
      "coverImage",
      coverImageRef.current.files[0]
    );

    registerData.append(
      "fullName",
      formData.fullName
    );

    registerData.append(
      "userName",
      formData.userName
    );

    registerData.append(
      "email",
      formData.email
    );

    registerData.append(
      "password",
      formData.password
    );

    try {
      await dispatch(createAccount(registerData)).unwrap();

      setFormData({
        fullName: "",
        userName: "",
        email: "",
        password: "",
      });

      avatarRef.current.value = null;
      coverImageRef.current.value = null;

      setAvatarPreview(null);
      setCoverPreview(null);

      dispatch(currentUser());

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      dispatch(setError(err || "Registration failed"));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center px-3 py-5"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #0f0f0f, #181818)",
      }}
    >
      <form
        onSubmit={handleOnSubmit}
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: "550px",
          backgroundColor: "#212121",
          borderRadius: "20px",
          padding: "35px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="text-center mb-4">
          <img src="/videoNairy_logo.png" alt="VideoNairy" width="60" className="mb-3" />

          <h2
            style={{
              color: "#fff",
              fontWeight: "700",
            }} >
            Create Account
          </h2>

          <p
            style={{
              color: "#aaaaaa",
              marginBottom: 0,
            }} >
            Join VideoNairy today
          </p>
        </div>

        {/* Avatar Preview */}
        <div className="mb-4">
          <label className="form-label" style={{ color: "#fff" }} >
            Profile Picture
          </label>

          {avatarPreview && (
            <div className="text-center mb-3">
              <img src={avatarPreview} alt="Avatar Preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "4px solid #3ea6ff",
                }}
              />
            </div>
          )}

          <input type="file" accept="image/*" className="form-control" ref={avatarRef}
            onChange={(e) => {
              if (e.target.files[0]) {
                setAvatarPreview(
                  URL.createObjectURL(e.target.files[0])
                );
              }
            }}
            style={{
              backgroundColor: "#303030",
              color: "#fff",
              border: "1px solid #444",
            }}
          />
        </div>

        {/* Cover Preview */}
        <div className="mb-4">
          <label className="form-label" style={{ color: "#fff" }} >
            Cover Image
          </label>

          {coverPreview && (
            <div className="mb-3">
              <img src={coverPreview} alt="Cover Preview"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "2px solid #444",
                }}
              />
            </div>
          )}

          <input type="file" accept="image/*" className="form-control" ref={coverImageRef}
            onChange={(e) => {
              if (e.target.files[0]) {
                setCoverPreview(
                  URL.createObjectURL(e.target.files[0])
                );
              }
            }}
            style={{
              backgroundColor: "#303030",
              color: "#fff",
              border: "1px solid #444",
            }}
          />
        </div>

        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label" style={{ color: "#fff" }} >
            Full Name
          </label>

          <input type="text" className="form-control" value={formData.fullName}
            onChange={handleOnChange} name="fullName" placeholder="Enter your full name"
            style={{
              backgroundColor: "#303030",
              border: "1px solid #444",
              color: "#fff",
              height: "48px",
            }}
          />
        </div>

        {/* Username */}
        <div className="mb-3">
          <label className="form-label" style={{ color: "#fff" }} >
            Username
          </label>

          <input type="text" className="form-control" value={formData.userName}
            onChange={handleOnChange} name="userName" placeholder="Choose a username"
            style={{
              backgroundColor: "#303030",
              border: "1px solid #444",
              color: "#fff",
              height: "48px",
            }}
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label" style={{ color: "#fff" }} >
            Email Address
          </label>

          <input type="email" className="form-control" value={formData.email} onChange={handleOnChange}
            name="email" placeholder="Enter your email"
            style={{
              backgroundColor: "#303030",
              border: "1px solid #444",
              color: "#fff",
              height: "48px",
            }}
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label" style={{ color: "#fff" }} >
            Password
          </label>

          <input type="password" className="form-control" value={formData.password}
            onChange={handleOnChange} name="password" placeholder="Create a password"
            style={{
              backgroundColor: "#303030",
              border: "1px solid #444",
              color: "#fff",
              height: "48px",
            }}
          />
        </div>

        <div className="mb-4">
          <Link to="/users/login"
            style={{
              color: "#3ea6ff",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Already have an account?
          </Link>
        </div>

        <button className="btn w-100" type="submit" disabled={loading}
          style={{
            backgroundColor: "#3ea6ff",
            color: "#fff",
            height: "50px",
            borderRadius: "10px",
            border: "none",
            fontWeight: "600",
          }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
      <ManageAction error={error} successMsg={successMsg} loading={loading} />
    </div>
  );
}

export default Register;