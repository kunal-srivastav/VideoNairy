import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../features/users/userSlice';
import { createAccount, currentUser } from '../features/users/userThunks';
import ManageAction from '../components/ManageAction';

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "", userName: "", email: "", password: ""
  });

  const avatarRef = useRef(null);
  const coverImageRef = useRef(null);

  const dispatch = useDispatch();
  const { loading, error, successMsg } = useSelector(state => state.users);

  // Update form data state when inputs change
  const handleOnChange = (e) => {
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev, [name]: value
    }));
  };

  // Submit form data to the server
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    // create a new FormData object and append the formData to it
    const registerData = new FormData();
    registerData.append("avatar", avatarRef.current.files[0]);
    registerData.append("coverImage", coverImageRef.current.files[0]);
    registerData.append("fullName", formData.fullName);
    registerData.append("userName", formData.userName);
    registerData.append("email", formData.email);
    registerData.append("password", formData.password);

    try {
      await dispatch(createAccount(registerData)).unwrap();
      setFormData({ fullName: "", userName: "", email: "", password: "" });
      avatarRef.current.value = null;
      coverImageRef.current.value = null;
      dispatch(currentUser());
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      dispatch(setError(err || "Registration failed"));
    } 
  }

  return (
    <div className="d-flex justify-content-center mt-4">
    <form onSubmit={handleOnSubmit} className="p-4 p-md-5 border rounded-3 bg-body-tertiary">
        <div className="input-group mb-3">
            <input type="file" accept='image/*' className="form-control" ref={avatarRef} name="avatar" id="inputGroupFile01" />
        </div>
        <div className="input-group mb-3">
            <input type="file" accept='image/*' className="form-control" ref={coverImageRef} name="coverImage" id="inputGroupFile02" />
        </div>
        <div className="form-floating mb-3">
            <input type="text" className="form-control" value={formData.fullName} onChange={handleOnChange} name="fullName" id="floatingText" placeholder="fullname" />
            <label htmlFor="floatingText">Fullname</label>
          </div>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" value={formData.userName} onChange={handleOnChange} name="userName" id="floatingText2" placeholder="Username" />
            <label htmlFor="floatingText2">Username</label>
          </div>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" value={formData.email} onChange={handleOnChange} name='email' id="floatingInput" placeholder="name@example.com" />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" value={formData.password} onChange={handleOnChange} name='password' id="floatingPassword" placeholder="Password" />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <Link to={"/users/login"}>Already have an account?</Link>
          <button className="w-100 btn mt-2 btn-lg btn-primary" type="submit">Sign up</button>
          <ManageAction error={error} successMsg={successMsg} loading={loading} />
        </form>
    </div>
  )
}

export default Register;