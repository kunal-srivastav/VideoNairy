const { cookieOptions } = require("../utlis/cookieOptions");
const { generateAccessAndRefreshToken } = require("../middleWares/generaterTokens");
const userModel = require("../models/userModel");
const {uploadOnCloudinary, deleteImgOnCloudinary} = require("../utlis/cloudinary");
const jwt = require("jsonwebtoken");

module.exports.registerUser = async (req, res) => {
    try {
        const {fullName, userName, email, password} = req.body;
        if (!fullName || !userName || !email || !password) return res.status(400).json({message: "All fields are required"});
        
        // find the user if already registered then return you have already an account
        const existedUser = await userModel.findOne({ $or:[ {email}, {userName}]});
        if(existedUser) return res.status(409).json({message: "You have already an account, Please login.."});
    
        const avatarLocalPath = req.files?.avatar ? req.files.avatar[0].path : "";
        const coverImageLocalPath = req.files?.coverImage ? req.files.coverImage[0].path : "";
        
        // upload them to cloudinary, avatar and coverImage
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
        if(!avatar) return res.status(400).json({message: "Avatar image is required"});
    
        const createdUser = await userModel.create({fullName, userName: userName.toLowerCase(), email, password, avatar: avatar.secure_url, coverImage: coverImage?.secure_url || ""})
        const newUser = await userModel.findById(createdUser._id).select("-password -refreshToken");
    
        // generate access and refresh token
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(createdUser);
        return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions.accessToken)
        .cookie("refreshToken", refreshToken, cookieOptions.refreshToken)
        .json({message: "Account created successfully!", newUser});
    } catch (err) {
    return res.status(500).json({message: "Failed to create account"});
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
    
        // check email or password is not empty
        if(!email) return res.status(400).json({message: "Email is required"});
        if(!password) return res.status(400).json({message: "Password is required"});
        const user = await userModel.findOne({email});
        if(!user) return res.status(404).json({message: "Incorrect email or password"});
    
        // check password is valid
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if(!isPasswordCorrect) return res.status(404).json({message: "Incorrect email or password"});
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user);
        return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions.accessToken)
        .cookie("refreshToken", refreshToken, cookieOptions.refreshToken)
        .json({message: "Successfully loggedIn", user});
    } catch (err) {
        return res.status(500).json({message: "Login failed"})
    }
};

module.exports.logOut = async (req, res) => {
    await userModel.findOneAndUpdate({email: req.user.email}, {$unset: {refreshToken: 1}}, {new: true});
    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions.accessToken)
    .clearCookie("refreshToken", cookieOptions.refreshToken)
    .json("User logout")
};

module.exports.refreshToken = async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken) return res.status(401).json("unauthorized request");
    try {
        // Token decode
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await userModel.findOne({email: decodedToken.email});
        if(!user) return res.status(401).json("Invalid refresh token");

        if(incomingRefreshToken !== user.refreshToken) return res.status(403).json("Refresh Token is expired or used");
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user);
        res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions.accessToken)
        .cookie("refreshToken", refreshToken, cookieOptions.refreshToken)
        .json("Access token is refreshed");
    } catch (err) {
        return res.status(403).json({ message: "Refresh token expired or invalid" });
    }
};

module.exports.changeCurrentPassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword) return res.status(400).json({message: "All fields are required"});
    const {email} = req.user;
    const user = await userModel.findOne({email});
    try {
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if(!isPasswordCorrect) return res.status(401).json({message: "Invalid Password"});
        user.password = newPassword;
        await user.save({validateBeforeSave: true});
        return res
        .status(200)
        .json({message: "Successfully password changed"});
    } catch (err) {
     return res.status(400).json({message: "Password unchanged"})
    }
};

module.exports.getCurrentUser = async (req, res) => {
    try {
        return res
        .status(200)
        .json({
            message: "successfully get current user",
            user: req.user
        });
    } catch (err) {
        return res.status(500).json({message: "Unable to fetch current data"});
    }
};

module.exports.updateAcountDetails = async (req, res) => {
    const {fullName, userName, email} = req.body;
    if(!(fullName || userName || email)) return res.status(400).json({message: "All fields are required"});
    const updatedUser = await userModel.findOneAndUpdate({email: req.user.email}, {$set: {fullName, userName, email}}, {new: true});
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(updatedUser);
    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions.accessToken)
    .cookie("refreshToken", refreshToken, cookieOptions.refreshToken)
    .json({
        message: "successfully updated",
        updatedUser
    })
};

module.exports.updateUserImage = async (req, res) => {
    try {
        const imageType = req.params.type;
        const imageField = imageType === 'avatar' ? 'avatar' : 'coverImage';
        const localImagePath = req.file? req.file.path : "";
        const oldAvatar = req.user.avatar;
        const oldCoverImage = req.user.coverImage;
        if(!localImagePath) return res.status(400).json({message: "Image is required"});
        const newUploadedImage = await uploadOnCloudinary(localImagePath);
        const updatedUser = await userModel.findOneAndUpdate({email: req.user.email}, { $set: {[imageField]: newUploadedImage?.secure_url}}, {new: true});
        if(updatedUser) {
            if(imageType === "avatar") {
                await deleteImgOnCloudinary(oldAvatar);
            } else {
                await deleteImgOnCloudinary(oldCoverImage);
            }
        }
        return res
        .status(200)
        .json({
            message: "Image changed successfully",
            updatedUser
        });
    } catch (err) {
        return res.status(500).json({message: "Image upload failed"});
    }
};

module.exports.getUserChannelProfile = async (req, res) => {
    const {userName} = req.params;
    if(!userName) return res.status(404).json({message: "User not found"});

    const channel = await userModel.aggregate([
        {
            $match: {userName}
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "userVideos",
                pipeline: [
                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            duration: 1,
                            views: 1,
                            owner: 1,
                            createdAt: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from : "playlists",
                localField: "_id",
                foreignField: "creator",
                as: "userPlaylists",
                pipeline: [
                    {
                        $sort: { createdAt: -1 }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "postBy",
                as: "userPosts",
                pipeline: [
                    {
                        $sort: { createdAt: -1 }
                    }
                ]
            }
        },
        {
            $addFields: {
                videos: "$userVideos",
                playlists: "$userPlaylists",
                posts: "$userPosts",
                subscribersCount: {
                    $size: "$subscribers"
                },

                channelIsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                   $cond: {
                    if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                    then: true,
                    else: false
                   }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount:1,
                channelIsSubscribedToCount: 1,
                isSubscribed:1,
                videos: 1,
                playlists: 1,
                posts: 1
            }
        }
    ]);
    
    if(!channel.length) return res.status(200).json({message: "Channel does not exists"});

    return res
    .status(200)
    .json(channel[0])
};

module.exports.getWatchHistory = async (req, res) => {
    try {
        const user = await userModel.aggregate([
        {
            $match: {
                _id: req.user?._id
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "ownerDetails",
                        pipeline: [
                        {
                            $project: {
                                userName: 1,
                                avatar: 1,
                            }
                        }]                        
                    }
                },
                {
                    $addFields: {
                        owner: {
                            $first: "$ownerDetails"
                        }
                    }
                },
                {
                    $project: {
                        title: 1,
                        duration: 1,
                        thumbnail: 1,
                        views: 1,
                        owner: 1,
                        createdAt: 1,
                    }
                }
            ]
            }
        },   
        ]);
        return res
        .status(200)
        .json(user[0].watchHistory);
    } catch (err) {
        return res.status(404).json(err.message)
    }
};