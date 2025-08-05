const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Comment", commentSchema);