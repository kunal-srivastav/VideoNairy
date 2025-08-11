const {v2: cloudinary} = require("cloudinary")
const fs = require("fs");

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
});

    
const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("local path", localFilePath);
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"});
        // file has been uploaded successfully
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath) // remove the locally saved tempory file as the upload operation got failed
        return null;
    }
}

const deleteImgOnCloudinary = async (imageUrl) => {
     try {
        if (!imageUrl) return null;

        const publicId = imageUrl.split('/').pop().split('.')[0];  // Extract public ID
        const result = await cloudinary.uploader.destroy(publicId, {resource_type: "image"});;
        return result;
    } catch (error) {
        throw error;
    }
}


const deleteVideoOnCloudinary = async (videoUrl) => {
     try {
        if (!videoUrl) return null;

        const publicId = videoUrl.split('/').pop().split('.')[0];  // Extract public ID
        const result = await cloudinary.uploader.destroy(publicId, {resource_type: "video"});;
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {uploadOnCloudinary, deleteImgOnCloudinary, deleteVideoOnCloudinary}