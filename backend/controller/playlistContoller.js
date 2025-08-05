const playListModel = require("../models/playListModel");
const videoModel = require("../models/videoModel")
const { uploadOnCloudinary, deleteImgOnCloudinary } = require("../utlis/cloudinary");

module.exports.createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body;
        if(!name) return res.status(400).json("Name is required");

        const playlistImageLocalPath = req.file ? req.file.path : null;
        if(!playlistImageLocalPath) return res.status(400).json("Playlist image is required");

        const playlistImage = await uploadOnCloudinary(playlistImageLocalPath, "playlistImage");

         // Check for existing playlist by name only
        const playList = await playListModel.findOne({name});
        if(playList) return res.status(400).json("This playlist already exists");

        const playListCreated = await playListModel.create({name, description : description || "",playlistImage: playlistImage.url, creator: req.user._id});

        return res
        .status(201)
        .json({
            message: "Playlist created successfully",
            playListCreated
        })
    } catch (error) {
        return res.status(500)
        .json(`Internal server error ${error.message}`);
    }
};

module.exports.addVideoToPlaylist = async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;

        // Fetch playlist and video in parallel
        const [playlist, video] = await Promise.all([
        playListModel.findById(playlistId),
        videoModel.findById(videoId).select("-description")
        ]);

        if(!playlist) return res.status(404).json("Playlist not found");
        if(!video) return res.status(404).json("Video not found");

        // Check ownership
        if(!playlist.creator.equals(req.user._id) || !video.owner.equals(req.user._id)) 
        return res.status(403).json("You don't have any permission to add this video to the playlist");

        // Check video exists
        const videoExist = await playListModel.findOne({_id: playlist._id, videos: videoId});
        if(videoExist) return res.status(400).json("This video is already exists in the playlist");

        const addVideo = await playListModel.findByIdAndUpdate(playlistId,{$addToSet: {videos: videoId}}, {new: true});

        return res
        .status(200)
        .json({
            message: "Video added successfully",
            addVideo
        });

    } catch (error) {
        return res
        .status(500)
        .json(`Internal server error ${error.message}`);
    }
};

module.exports.removeVideoFromPlaylist = async (req, res) => {
    try {
        const {playlistId, videoId} = req.params;

        const [playlist, video] = await Promise.all([
            playListModel.findById(playlistId),
            videoModel.findById(videoId)
        ]);

        if(!playlist) return res.status(404).json("Playlist not found");

        if(!video) return res.status(404).json("Video not found");
        
        //check ownership
        if(!playlist.creator.equals(req.user._id) || !video.owner.equals(req.user._id)) return res.status(403).json("You dont't have any permission to remove this video in the playlist");

        const removedVideo = await playListModel.findByIdAndUpdate(playlistId, {$pull : {videos: videoId}}, {new: true});

        return res
        .status(200)
        .json({
            message: "Video removed in the playlist",
            removedVideo
        })

    } catch (error) {
        return res
        .status(500)
        .json(`Internal server error ${error.message}`);
    }
}

module.exports.getPlayListById = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const playlist = await playListModel.findById(playlistId).populate([
            { path: "creator", select: "avatar userName" },
            { path: "videos", select: "title thumbnail" }
        ]);
        if(!playlist) return res.status(404).json("Playlist not found");

        return res
        .status(200)
        .json({
            message: "User playlist",
            playlist
        })
    } catch (error) {
        return res
        .status(500)
        .json(`Internal server error ${error.message}`);
    }
};

module.exports.updatePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const playList = await playListModel.findById(playlistId);
        if(!playList) return res.status(404).json("Playlist not found");
        if(String(req.user._id) !== String(playList.creator)) return res.status(403).json("You don't have any permission to update in the playlist");
        const oldPlaylistImage = playList.playlistImage;
        const { name, description } = req.body;
        const newPlaylistImageLocalPath = req.file ? req.file.path : playList.image;
        if(!newPlaylistImageLocalPath) return res.status(400).json("Playlist image is required");
        const newPlaylistImage = await uploadOnCloudinary(newPlaylistImageLocalPath);
        if(!name) return res.status(400).json("Name is required");
        const updatedPlaylist = await playListModel.findByIdAndUpdate(playlistId, {$set: {name, description:  description || playList.description, playlistImage: newPlaylistImage?.url || playList.playlistImage}}, {new: true});
        if(newPlaylistImage && updatedPlaylist) {
            await deleteImgOnCloudinary(oldPlaylistImage);
        }
        return res
        .status(200)
        .json({
            message: "Playlist updated successfully",
            updatedPlaylist
        });
    } catch (error) {
        return res
        .status(500)
        .json(`Internal server error ${error.message}`);
    }
};

module.exports.deletePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const playlist = await playListModel.findById(playlistId);
        if(!playlist) return res.status(404).json("Playlist not found");

        if(String(req.user._id) !== String(playlist.creator)) return res.status(403).json("You don't have any permission to delete this playlist");
        const oldPlaylistImage = playlist.playlistImage;
        
        const deletedPlaylist = await playListModel.findByIdAndDelete(playlistId);
        if(deletedPlaylist && oldPlaylistImage) {
            await deleteImgOnCloudinary(oldPlaylistImage);
        }
        return res
        .status(200)
        .json({
            message: "Playlist deleted Successfully",
            deletedPlaylist
        });
    } catch (error) {
        return res
        .status(500)
        .json(`Internal server error ${error.message}`);
    }
};