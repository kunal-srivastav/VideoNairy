import { useEffect } from "react";
import { clearMsg } from "../features/users/userSlice";
import { useDispatch } from "react-redux";

function ManageAction({ error, successMsg, loading }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (error || successMsg) {
      const timer = setTimeout(() => {
        dispatch(clearMsg());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, successMsg, dispatch]);

  return (
    <>
      {(error || successMsg) && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{
            zIndex: 1080,
            minWidth: "320px",
            maxWidth: "90vw",
          }}
        >
          {error ? (
            <div
              className="alert border-0 shadow-lg d-flex align-items-center"
              role="alert"
              style={{
                backgroundColor: "#dc3545",
                color: "#fff",
                borderRadius: "12px",
              }}
            >
              <span className="me-2 fs-5">⚠️</span>
              <span>{error}</span>
            </div>
          ) : (
            <div
              className="alert border-0 shadow-lg d-flex align-items-center"
              role="alert"
              style={{
                backgroundColor: "#198754",
                color: "#fff",
                borderRadius: "12px",
              }}
            >
              <span className="me-2 fs-5">✅</span>
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            zIndex: 1060,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="text-center p-4 shadow-lg"
            style={{
              backgroundColor: "#212121",
              borderRadius: "16px",
              minWidth: "180px",
            }}
          >
            <div
              className="spinner-border text-primary mb-3"
              style={{
                width: "3rem",
                height: "3rem",
              }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>

            <p
              className="mb-0"
              style={{
                color: "#fff",
                fontWeight: "500",
              }}
            >
              Please wait...
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageAction;