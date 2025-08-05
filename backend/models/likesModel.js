const mongoose = require("mongoose");

const likesSchema = mongoose.Schema(
    {
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        } ,
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        posts: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("like", likesSchema);