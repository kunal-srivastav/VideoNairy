import { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { MdNotificationsActive } from "../assets/Icons";
import { useDispatch, useSelector } from 'react-redux';
import { subscribedChannels, toggleSubscription } from '../features/subscriptions/subscriptionThunks';
import ManageAction from '../components/ManageAction';

function Subscription() {

  const dispatch = useDispatch();
  const { loading, subscriptions } = useSelector((state) => state.subscriptions);

  useEffect(() => { 
    dispatch(subscribedChannels());
  }
  ,[dispatch]);

  const handleOnToggleSubscription = async (channelId) => {
    await dispatch(toggleSubscription(channelId)).unwrap();
  }

  return (
  <div className='p-5 text-light'>
    <h1 className='fw-bold ps-5'>All subscriptions</h1>
    <div className="list-group container">
    {subscriptions && subscriptions.length > 0 ? (
      subscriptions.map(({channel}) => (
        <div key={channel._id} className="list-group-item list-group-item-action d-flex gap-3 py-3">
        <Link to={`/users/profile/${channel.userName}`} className="d-flex w-75 gap-3 text-decoration-none text-light">
          <img src={channel?.avatar} alt=""  width="120" height="120" className="rounded-circle" />
          <div className="mt-4 w-100">
            <div className="col">
              <h6 className="mb-0 text-dark">{channel?.fullName}</h6>
              <p className="mb-0 text-muted opacity-75">{channel?.userName} • {channel?.subscriberCount} subscribers</p>
            </div>
          </div>
        </Link>
        <button className="btn btn-secondary mt-5 h-25" style={{ width: "150px" }} onClick={() => {handleOnToggleSubscription(channel._id)}} >
            <MdNotificationsActive size={20} /> {channel.isSubscribed ? "Subscribed" : "Unsubscribed"}
          </button>
        </div>
      ))
    ) : (
      !loading && <h2 className="text-center">You're not subscribed to any channel.</h2>
    )}

    </div>
    <ManageAction loading={loading} />
  </div>
  
)
}

export default Subscription;