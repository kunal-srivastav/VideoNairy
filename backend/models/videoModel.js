const mongoose = require("mongoose");

const videoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        duration: {
            type: Number,
            required: true
        },
        thumbnail: {
            type: String   // cloudinary url
        },
        videoFile: {
            type: String,  // cloudinary url
            required: true,
            unique: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Video", videoSchema);