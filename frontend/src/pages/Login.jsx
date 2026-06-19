import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setError } from "../features/users/userSlice";
import { loginUser, currentUser } from "../features/users/userThunks";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error, successMsg } = useSelector(
    (state) => state.users
  );

  const dispatch = useDispatch();

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      await dispatch(loginUser(loginData)).unwrap();
      await dispatch(currentUser()).unwrap();

      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      dispatch(setError(err) || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center px-3"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #0f0f0f, #181818)"
      }}
    >
      <form
        onSubmit={handleOnSubmit}
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: "430px",
          backgroundColor: "#212121",
          borderRadius: "20px",
          padding: "35px",
          border: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/videoNairy_logo.png"
            alt="VideoNairy"
            width="60"
            className="mb-3"
          />

          <h2
            style={{
              color: "#fff",
              fontWeight: "700"
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              color: "#aaaaaa",
              marginBottom: 0
            }}
          >
            Sign in to continue to VideoNairy
          </p>
        </div>

        <div className="mb-3">
          <label
            className="form-label"
            style={{ color: "#fff" }}
          >
            Email Address
          </label>

          <input
            type="email"
            className="form-control"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              backgroundColor: "#303030",
              border: "1px solid #444",
              color: "#fff",
              height: "48px"
            }}
          />
        </div>

        <div className="mb-3">
          <label
            className="form-label"
            style={{ color: "#fff" }}
          >
            Password
          </label>

          <input
            type="password"
            className="form-control"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              backgroundColor: "#303030",
              border: "1px solid #444",
              color: "#fff",
              height: "48px"
            }}
          />
        </div>

        <div className="mb-4">
          <Link
            to="/users/register"
            style={{
              color: "#3ea6ff",
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Create an Account
          </Link>
        </div>

        <button
          className="btn w-100"
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#3ea6ff",
            color: "#fff",
            height: "48px",
            borderRadius: "10px",
            fontWeight: "600",
            border: "none"
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <hr
          className="my-4"
          style={{
            borderColor: "#444"
          }}
        />

        <small
          style={{
            color: "#9e9e9e",
            display: "block",
            textAlign: "center"
          }}
        >
          By clicking Sign In, you agree to the terms of use.
        </small>
      </form>
    </div>
  );
}

export default Login;