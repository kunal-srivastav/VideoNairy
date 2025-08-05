import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { setError } from '../features/users/userSlice';
import { loginUser, currentUser } from '../features/users/userThunks';
import ManageAction from '../components/ManageAction';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const { loading, error, successMsg } = useSelector((state) => state.users);

  const dispatch = useDispatch();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const loginData = {email, password};
      try {
        await dispatch(loginUser(loginData)).unwrap();
        await dispatch(currentUser()).unwrap();
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/");
        }, 2000)
      } catch (err) {
        dispatch(setError(err) || "Login failed");
      } 
  }

  return (
    <div className="d-flex justify-content-center mt-5">
    <form onSubmit={handleOnSubmit} className="p-4 p-md-5 border rounded-3 bg-body-tertiary">
          <div className="form-floating mb-3">
            <input type="email" className="form-control" name="email" value={email} onChange={(e) => {setEmail(e.target.value)}} id="floatingInput" placeholder="name@example.com" />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" name="password" value={password} onChange={(e) => {setPassword(e.target.value)}} id="floatingPassword" placeholder="Password" />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <Link to={"/users/register"} >Create an Account</Link>

          <button className="w-100 btn btn-lg btn-primary mt-3" id="liveToastBtn" type="submit">Sign in</button>
          <hr className="my-4" />
          <small className="text-body-secondary">By clicking Sign in, you agree to the terms of use.</small>
        <ManageAction error={error} successMsg={successMsg} loading={loading} />
    </form>
    </div>
  )
}

export default Login;