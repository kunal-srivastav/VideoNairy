const likesModel = require("../models/likesModel");
const videoModel = require("../models/videoModel");
const subscriptionModel = require("../models/subscriptionModel");
const userModel = require("../models/userModel");
const { uploadOnCloudinary, deleteImgOnCloudinary, deleteVideoOnCloudinary } = require("../utlis/cloudinary");

module.exports.videoUpload = async (req, res) => {
    try {
        const { title, description, isPublished } = req.body;
        const { id } = req.user;
        if(!title) return res.status(400).json("Title is required");
        
        const thumbnailLocalPath = req.files.thumbnail? req.files.thumbnail[0].path : "";
        const videoFileLocalPath = req.files.videoFile? req.files.videoFile[0].path : "";
        
        if(!videoFileLocalPath) return res.status(400).json("Video file is required");
    
        // upload on cloudinary
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    
        const uploadedVideo = await videoModel.create({title, description: description || "", thumbnail: thumbnail? thumbnail.url : "", videoFile: videoFile.url, duration: videoFile.duration, isPublished, owner: id});
        return res
        .status(201)
        .json({
            message: "Video uploaded successfully",
            uploadedVideo
        })
    } catch (error) {
        return res.status(500).json(`Internal server error ${error.message}`);
    }
};

module.exports.getAllVideos = async (req, res) => {
    try {
        const {page, limit, query, sortBy, sortType} = req.query;
        
        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 12;
        const skip = (pageNumber - 1) * pageSize;

        const sortField = sortBy || "createdAt";  // Default to "createdAt"
        const sortOrder = sortType === "asc" ? 1 : -1;  // Default to descending

        let filter = {};
        if (query) {
            filter.title = { $regex: query, $options: "i" }; // Case-insensitive search
        }

        const totalVideos = await videoModel.countDocuments(filter);
        const totalPages = Math.ceil(totalVideos/pageSize);

        const videos = await videoModel
        .find(filter)
        .sort({[sortField] : sortOrder})
        .skip(skip)
        .limit(pageSize)
        .populate("owner", "userName email avatar");

        if(!videos.length) return res.status(404).json("Video not found");

        return res
        .status(200)
        .json({
            message: "All videos fetched successfully",
            videos,
            totalResults: videos.length,
            page: pageNumber,
            limit: pageSize,
            totalPages
        });

    } catch (error) {
        return res.status(500).json(`Internal server error ${error.message}`);
    }
};

module.exports.getVideoById = async (req, res) => {
    const userId = req.user?._id;
    const { videoId } = req.params;
    try {
        const video = await videoModel.findById(videoId).populate("owner", "userName email avatar");
        if(!video) return res.status(404).json("Video not found");
        if(userId){
        video.views += 1; // Increment view count
        await video.save();
        }
        const totalLikes = await likesModel.countDocuments({video: videoId});
        const totalSubscriber = await subscriptionModel.countDocuments({channel: video.owner});
        const [isLiked, isSubscribed] = await Promise.all([
            likesModel.exists({ video: videoId, likedBy: userId }),
            subscriptionModel.exists({ subscriber: userId, channel: video.owner._id }),
        ]);
        if (userId) {
            await userModel.findByIdAndUpdate(userId, {
                $addToSet: { watchHistory: videoId }, // prevents duplicates
            });
        }
        if(!video) return res.status(200).json("Video not found");

        return res
        .status(200)
        .json({
            video,
            isLiked: !!isLiked,
            isSubscribed: !!isSubscribed,
            totalLikes,
            totalSubscriber
        });
    } catch (err) {
        return res.status(500).json(`Internal server error ${err.message}`)
    }
};

module.exports.updateVideo = async (req, res) => {
   try {
    const {videoId} = req.params;
    const userId = req.user._id;

    const video = await videoModel.findById(videoId);
    if(!video) return res.status(404).json("Video not found");

    if(String(userId) !== String(video.owner)) return res.status(403).json("You don't have any permission to change");
    const oldThumbnail = video.thumbnail;

    const {title, description, isPublished} = req.body;
    
    const thumbnailLocalPath = req.file? req.file.path : "";
    let newThumbnail = null;
    if(thumbnailLocalPath) {
        newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    };
    const updatedVideo = await videoModel.findByIdAndUpdate(videoId, {title: title || video.title, description: description || video.description, thumbnail: newThumbnail?.url || video.thumbnail, isPublished: isPublished || video.isPublished}, {new: true});
    if (newThumbnail?.url && oldThumbnail) {
        await deleteImgOnCloudinary(oldThumbnail);
    };
    return res
    .status(200)
    .json({
        message: "Video updated successfully",
        updatedVideo
    })
   } catch (error) {
        return res.status(500).json(`Internal Server Problem ${error.message}`)
   }
};

module.exports.deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id;
        const video = await videoModel.findById(videoId);
        if(!video) return res.status(400).json({error: "Video Id is required"});
        const videoThumbnailUrl = video?.thumbnail;
        const videoFileUrl = video?.videoFile

        if(String(userId) !== String(video.owner)) return res.status(403).json("You don't have any permission to delete this video");
        
        try {
        if (videoThumbnailUrl) {
            await deleteImgOnCloudinary(videoThumbnailUrl);
        }

        if (videoFileUrl) {
            await deleteVideoOnCloudinary(videoFileUrl);
        }
        } catch (err) {
        return res.status(500).json({ message: `Failed to delete media files: ${err.message}` });
        }

        const deletedVideo = await videoModel.findByIdAndDelete(videoId);
        return res
        .status(200)
        .json({
            message: "Video has been deleted",
            deletedVideoId: deletedVideo._id
        });
    } catch (error) {
        return res.status(500).json(`Internal server error ${error.message}`);
    }
};





