const mongoose = require("mongoose");
const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");

module.exports.getVideoComments = async (req, res) => {
    //get all comments for a video
    try {
        const { videoId } = req.params;
        const { page, limit, sortBy } = req.query;

        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit)  || 5;

        const skip = (pageNumber - 1) * pageSize;

        const sortField = "createdAt";
        const sortOrder = sortBy === "oldest" ? 1 : -1; // oldest = ASC, newest = DESC

        const totalComments = await commentModel.countDocuments({video: videoId});
        const totalPages = Math.ceil(totalComments/pageSize);

        const videoComments = await commentModel.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            },
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
                    }
                   ]
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "comment",
                    as: "likes",
                }
            },
            {
                $addFields: {
                    owner: "$owner",
                    likesCount: { $size: "$likes" },
                    isLiked: {
                        $cond: {
                            if: {$in: [req.user?._id, "$likes.likedBy"]},
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $unwind: "$owner"
            },
            {
                $sort: {
                    [sortField]: sortOrder
                  }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    owner: 1,
                    isLiked: 1,
                    likesCount: 1,
                }
            }
        ]);
        if(!videoComments.length) return res.status(404).json({message: "No comments found for this video"});
        return res
        .status(200)
        .json({
            message: "All comments on a video",
            videoComments,
            videoId: videoId,
            totalResults: totalComments,
            page: pageNumber,
            limit: pageSize,
            totalPages
        });
    } catch (error) {
        return res.status(500).json({message: "Failed to fetch video comments"});
    }

};

module.exports.getPostComments = async (req, res) => {
    try {
        const postComments = await commentModel.aggregate([
            {
                $match: {
                    post: new mongoose.Types.ObjectId(req.params.postId)
                }
            },
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
                    }
                   ]
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "comment",
                    as: "likes",
                }
            },
            {
                $addFields: {
                    owner: "$owner",
                    likesCount: { $size: "$likes" },
                    isLiked: {
                        $cond: {
                            if: {$in: [req.user?._id, "$likes.likedBy"]},
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $unwind: "$owner"
            },
            {
                $sort: { createdAt: -1 }, // sort by latest comment
            },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    owner: 1,
                    isLiked: 1,
                    likesCount: 1,
                }
            }
        ]);
        if(!postComments.length) return res.status(404).json({message: "No comments found"});
        return res
        .status(200)
        .json({
            message: "All comments on a post",
            postComments,
            totalCommentsOnPost: postComments.length,
            postId: req.params.postId,
        });
    } catch (err) {
        return res.status(500).json({message: "Post not found"})
    }
};

module.exports.addComment = async (req, res) => {
  try {
    const { videoId, postId } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Comment content is required" });

    // Validate IDs if provided
    if (videoId && !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }
    if (postId && !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    let post;
    if(postId) {
        post = await postModel.findById(postId);
        if (!post) return res.status(200).json({ message: "Post not found" });
    }

    // Prepare comment data
    const commentData = { owner: req.user._id, content,
      ...(videoId && { video: videoId }),
      ...(postId && { post: postId }),
    };

    const newComment = await commentModel.create(commentData);
    await newComment.populate("owner", "avatar userName");

    if(postId) {
        post.comments.push(newComment._id);
        await post.save();
    };

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
};

module.exports.updateComment = async (req, res) => {
    //update a comment
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await commentModel.findById(commentId).populate("owner", "avatar userName");
    if(!comment) return res.status(404).json("Comment not found");

    if(String(comment.owner._id) !== String(userId)) return res.status(403).json({message: "You don't have any permission to update a comment"});

    const { content } = req.body;

    if(!content) return res.status(400).json({message: "Comment content is required"});
    comment.content = content;
    await comment.save();
    return res
    .status(200)
    .json({
        message: "Comment update successfully",
        updatedComment: comment
    })
};

module.exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const userId = req.user._id;

        const comment = await commentModel.findById(commentId);
        if(!comment) return res.status(404).json({message: "Comment not found"});

        if(comment.post) {
            const post = await postModel.findById(comment.post);
            post.comments = post.comments.filter(c => String(c._id) !== String(commentId));
            await post.save();
        }

        // check user and content owner
        if(String(userId) !== String(comment.owner)) return res.status(403).json({message: "You don't have any permission to delete this comment"});

        const deleteComment = await commentModel.findByIdAndDelete(commentId);
        return res
        .status(200)
        .json({
            message: "Comment deleted successfully",
            deleteComment
        })
    } catch (err) {
        return res.status(500).json({message: "Failed to delete comment"});
    }
};

