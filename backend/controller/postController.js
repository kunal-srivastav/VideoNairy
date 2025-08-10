const postModel = require("../models/postModel");
const { uploadOnCloudinary, deleteImgOnCloudinary } = require("../utlis/cloudinary");

module.exports.createUserPost = async (req, res) => {
    try {
        const imageLocalPath = req.file ? req.file.path : "";
        if (!imageLocalPath) {
            return res.status(400).json({ message: "Post image is required" });
        }

        const post = await uploadOnCloudinary(imageLocalPath);
        console.log(post)
        if (!post || !post.url) {
            return res.status(400).json({ message: "Error uploading image" });
        }

        const createPost = await postModel.create({
            postImage: post.url,
            postBy: req.user._id
        });

        return res.status(201).json({
            message: "Post created successfully",
            createPost
        });
    } catch (error) {
        return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};


module.exports.updateUserPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postModel.findById(postId);
        if(!post) return res.status(404).json("Post not found");

        if(String(req.user._id) !== String(post.postBy)) return res.status(403).json("You don't have any permission to update post");
        const oldPostImage = post.postImage;
        const postImageLocalPath = req.file? req.file.path : "";
        if(!postImageLocalPath) return res.status(400).json("Post image is required");

        const newPostImage = await uploadOnCloudinary(postImageLocalPath);

        const updatedPost = await postModel.findByIdAndUpdate(post._id, {$set: {postImage: newPostImage ? newPostImage.url : post.postImage}}, {new: true});
        if(updatedPost && newPostImage) {
            await deleteImgOnCloudinary(oldPostImage);
        }
        return res
        .status(200)
        .json({
            message: "Post is updated",
            updatedPost
        });
    } catch (error) {
        return res.status(500).json(`Internal server error ${error.message}`);
    }
};

module.exports.deleteUserPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postModel.findById(postId);
        if(!post) return res.status(404).json("Post not found");

        if(String(req.user._id) !== String(post.postBy)) return res.status(403).json("You don't have any permission to delete this post");
        const oldPostImage = post.postImage;
        
        const deletedPost = await postModel.findByIdAndDelete(postId);
        if(deletedPost) {
            await deleteImgOnCloudinary(oldPostImage);
        }
        return res
        .status(200)
        .json({
            message: "Post deleted",
            deletedPost
        })
    } catch (error) {
        return res
        .status(500)
        .json(`Internal server error ${error.message}`);
    }
};