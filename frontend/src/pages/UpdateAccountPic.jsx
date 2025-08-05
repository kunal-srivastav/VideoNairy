import { useState, useRef } from 'react';
import { LuUpload } from '../assets/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserImage } from '../features/users/userThunks';
import { setError } from '../features/users/userSlice';
import { useNavigate } from 'react-router-dom';
import ManageAction from '../components/ManageAction';

function UpdateAccountPic({name}) {

    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading, error, successMsg} = useSelector(state => state.users);

    function resetFormWithNavigate (userName) {
        setImage(null);
        setFile(null);
        setTimeout(() => {
        navigate(`/users/profile/${userName}`);
        }, 2000);
    }   

    const handleOnImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if(selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // base64 for preview only
            };
            reader.readAsDataURL(selectedFile); // Read file as Base64 string
        } else{
            setFile(null);
            setImage(null);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleOnUpdate = async (e) => {
        try {
            if (!file) {
                dispatch(setError("Please select an image first."));
                return;
            }

            const formData = new FormData();
            formData.append("image", file);

            const res = await dispatch(updateUserImage({type: name, formData})).unwrap();
            const { userName } = res.updatedUser;
            resetFormWithNavigate(userName);
        } catch (err) {
           return dispatch(setError(err?.message || "Error uploading image")); 
        }
    };

    return (
        <div className="d-flex flex-column align-items-center text-light py-4">
        <h3 className="mb-4">{name==="avatar" ? "Update Avatar" : "Update Cover Image"}</h3>
    
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleOnImageChange}
            style={{ display: 'none' }} />
    
        <button className="btn btn-primary" onClick={handleUploadClick} >
            <LuUpload className='me-2 mb-1' /> Upload Image
        </button>
    
        {image && ( 
            <div className='position-relative d-inline-block'>
            <div className="mt-4">
                <img src={image} alt="Preview" className="img img-fluid rounded shadow" style={{ maxWidth: '600px', minHeight: "300px" }} />
            </div>
            <button type="button" className="position-absolute mt-4 top-0 start-100 translate-middle btn-close" style={{ backgroundColor: 'white' }}
             aria-label="Remove" onClick={() => {
                setImage(null)
                setFile(null)
             }} />
                <button type='submit' className="btn btn-warning mt-2 float-end" disabled={loading} onClick={handleOnUpdate}>
                {"Update"}
                </button>
            </div>
        )}  
        <ManageAction error={error} successMsg={successMsg} loading={loading} />
        </div>
    )
}

export default UpdateAccountPic