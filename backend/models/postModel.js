const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
    {
        postImage: {
            type: String, //upload on cloudinary
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],
        like: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Like"
            }
        ],
        postBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },  
    },
    {timestamps: true}
);

module.exports = mongoose.model("Post", postSchema);