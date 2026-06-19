import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MdNotificationsActive } from "../assets/Icons";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribedChannels,
  toggleSubscription,
} from "../features/subscriptions/subscriptionThunks";
import ManageAction from "../components/ManageAction";

function Subscription() {
  const dispatch = useDispatch();

  const { loading, subscriptions } = useSelector(
    (state) => state.subscriptions
  );

  useEffect(() => {
    dispatch(subscribedChannels());
  }, [dispatch]);

  const handleOnToggleSubscription = async (channelId) => {
    await dispatch(toggleSubscription(channelId)).unwrap();
  };

  return (
    <div className="container-fluid px-3 px-md-5 py-4 text-light">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Subscriptions</h2>
        <p className="text-secondary mb-0">
          Manage channels you follow
        </p>
      </div>

      {subscriptions && subscriptions.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {subscriptions.map(({ channel }) => (
            <div key={channel._id} className="card border-0 shadow-sm"
              style={{
                backgroundColor: "#212121",
                borderRadius: "18px",
              }}
            >
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <Link to={`/users/profile/${channel.userName}`}
                      className="text-decoration-none text-light"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img src={channel?.avatar} alt={channel?.userName} width="90" height="90"
                          className="rounded-circle"
                          style={{
                            objectFit: "cover",
                            border: "3px solid #3ea6ff",
                          }}
                        />

                        <div>
                          <h5 className="mb-1 fw-semibold text-white">
                            {channel?.fullName}
                          </h5>

                          <p className="mb-1 text-secondary">
                            @{channel?.userName}
                          </p>

                          <small className="text-secondary">
                            {channel?.subscriberCount} subscribers
                          </small>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="col-lg-4 mt-3 mt-lg-0 text-lg-end">
                    <button
                      className={`btn ${
                        channel.isSubscribed
                          ? "btn-secondary"
                          : "btn-outline-light"
                      } rounded-pill px-4`}
                      onClick={() =>
                        handleOnToggleSubscription(channel._id)
                      }
                    >
                      <MdNotificationsActive size={18} />{" "}
                      {channel.isSubscribed
                        ? "Subscribed"
                        : "Subscribe"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: "50vh" }}
          >
            <div
              style={{
                fontSize: "70px",
                opacity: 0.4,
              }}
            >
              📺
            </div>

            <h3 className="mt-3">
              No subscriptions yet
            </h3>

            <p className="text-secondary">
              Channels you subscribe to will appear here.
            </p>
          </div>
        )
      )}

      <ManageAction loading={loading} />
    </div>
  );
}

export default Subscription;