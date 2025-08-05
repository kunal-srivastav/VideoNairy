const likesModel = require("../models/likesModel");
const videoModel = require("../models/videoModel");
const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");

module.exports.toggleVideoLike = async (req, res) => {
    try {
        const { videoId } = req.params;
        const video = await videoModel.findById(videoId);
        if(!video) return res.status(404).json("Video not found");

        const existingLike = await likesModel.findOneAndDelete({likedBy: req.user._id, video: videoId});
        if(existingLike) {
         const totalLikes = await likesModel.countDocuments({ video: videoId });
        return res
        .status(200)
        .json({
             message: "Video is unlike",
             isLiked: false,
             totalLikes
            });
        }
        const newLike = await likesModel.create({likedBy: req.user._id, video: videoId});
        const totalLikes = await likesModel.countDocuments({ video: videoId });
        return res
        .status(201)
        .json({
            message: "Video Liked",
            isLiked: true,
            newLike,
            totalLikes
        })
    } catch (err) {
        return res.status(500).json(`Internal server error ${err.message}`);
    }
};

module.exports.toggleCommentLike = async (req, res) => {
   try {
        const { commentId } = req.params;

        const commentByUser = await commentModel.findById(commentId);
        if(!commentByUser) return res.status(404).json("Comment not found");

        const unlikedComment = await likesModel.findOneAndDelete({likedBy: req.user._id, comment: commentId});
        if(unlikedComment) {
        const totalLikes = await likesModel.countDocuments({comment: commentId});
        return res
        .status(200)
        .json({
            commentId,
            message: "Comment unliked",
            isLiked: false,
            unlikedComment,
            likesCount: totalLikes
        })};
        const likedComment = await likesModel.create({likedBy: req.user._id, comment: commentId});
        const totalLikes = await likesModel.countDocuments({comment: commentId});
        return res
        .status(200)
        .json({
            commentId,
            message: "Comment is liked",
            likedComment,
            isLiked: true,
            likesCount: totalLikes
     });
   } catch (error) {
        return res.status(500).json(`Internal server error ${error.message}`);
   }
};

module.exports.togglePostLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id
        const post = await postModel.findById(postId);
        if(!post) return res.status(404).json("Post not found");   

        const alreadyLiked = post.like.some(user => user.equals(userId))
        let postLiked = null;
        let unlikedPost = null;
        let isLiked = false;

        if (alreadyLiked) {
            unlikedPost = await likesModel.findOneAndDelete({likedBy: userId, posts: post._id});
            post.like = post.like.filter(user => !user.equals(userId));
            isLiked = false;
        } else {
            postLiked = await likesModel.create({likedBy: userId, posts: postId});;
            post.like.push(userId);
            isLiked = true
        }

        post.totalLikes = post.like.length;
        await post.save();

        return res
        .status(200).
        json({
            message: isLiked? "Post liked" : "Post-Unliked",
            postLiked,
            unlikedPost,
            isLiked,
            postId,
            totalLikes: post.totalLikes
        })
    } catch (error) {
        return res.status(500).json(`Internal server error ${error.message}`);
    }
};

module.exports.getLikedVideo = async (req, res) => {
    try {
        const likedVideo = await likesModel.aggregate([
            {
                $match: {
                    likedBy: req.user._id
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "video",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            avatar: 1,
                                            userName: 1
                                        }
                                    },
                                    
                                ]
                            }
                        },
                        { 
                            $addFields: { 
                                owner: { 
                                    $first: "$owner"
                                } 
                            } 
                        }
                    ]
                }
            },
            {
                $unwind: "$video"
            }
        ]);
        return res
        .status(200)
        .json({
            message: "All liked video fetched",
            likedVideo
        })
    } catch (error) {
        return res.status(500).json(`Internal server error ${error.message}`);
    }
};