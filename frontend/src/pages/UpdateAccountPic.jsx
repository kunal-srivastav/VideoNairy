import { useState, useRef } from "react";
import { LuUpload } from "../assets/Icons";
import { useDispatch, useSelector } from "react-redux";
import { updateUserImage } from "../features/users/userThunks";
import { setError } from "../features/users/userSlice";
import { useNavigate } from "react-router-dom";
import ManageAction from "../components/ManageAction";

function UpdateAccountPic({ name }) {
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, successMsg } = useSelector(
    (state) => state.users
  );

  const resetFormWithNavigate = (userName) => {
    setImage(null);
    setFile(null);

    setTimeout(() => {
      navigate(`/users/profile/${userName}`);
    }, 2000);
  };

  const handleOnImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (
      selectedFile &&
      selectedFile.type.startsWith("image/")
    ) {
      setFile(selectedFile);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setImage(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleOnUpdate = async () => {
    try {
      if (!file) {
        dispatch(setError("Please select an image first."));
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const res = await dispatch(
        updateUserImage({
          type: name,
          formData,
        })
      ).unwrap();

      const { userName } = res.updatedUser;

      resetFormWithNavigate(userName);
    } catch (err) {
      dispatch(
        setError(
          err?.message || "Error uploading image"
        )
      );
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
        }}
      >
        <div className="p-4 p-md-5"
          style={{
            background: "#181818",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow: "0 8px 30px rgba(0,0,0,.3)",
          }}
        >
          <h2 className="text-center text-white fw-bold mb-2">
            {name === "avatar"
              ? "Update Avatar"
              : "Update Cover Image"}
          </h2>

          <p className="text-center text-secondary mb-4">
            Upload a new {name}
          </p>

          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleOnImageChange}
            style={{ display: "none" }} />

          {/* Upload Area */}
          {!image && (
            <div onClick={handleUploadClick}
              className="d-flex flex-column justify-content-center align-items-center text-center"
              style={{
                border: "2px dashed #444",
                borderRadius: "20px",
                minHeight: "280px",
                cursor: "pointer",
                transition: ".3s",
              }} >
              <LuUpload size={50} className="text-secondary mb-3" />

              <h5 className="text-light">
                Click to upload image
              </h5>

              <p className="text-secondary mb-0">
                JPG, PNG, WEBP supported
              </p>
            </div>
          )}

          {/* Preview */}
          {image && (
            <>
              <div className="text-center mt-4">
                {name === "avatar" ? (
                  <img src={image} alt="Avatar Preview" className="rounded-circle shadow"
                    style={{
                      width: "220px",
                      height: "220px",
                      objectFit: "cover",
                      border: "4px solid #333",
                    }}
                  />
                ) : (
                  <img src={image} alt="Cover Preview" className="img-fluid shadow"
                    style={{
                      width: "100%",
                      maxHeight: "350px",
                      objectFit: "cover",
                      borderRadius: "20px",
                    }}
                  />
                )}
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button type="button" className="btn btn-outline-light px-4 rounded-pill"
                  onClick={() => {
                    setImage(null);
                    setFile(null);
                  }} >
                  Remove
                </button>

                <button type="button" disabled={loading} onClick={handleOnUpdate}
                  className="btn btn-danger px-5 rounded-pill fw-bold" >
                  {loading
                    ? "Updating..."
                    : "Update Image"}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
      <ManageAction error={error} successMsg={successMsg} loading={loading} />
    </div>
  );
}

export default UpdateAccountPic;