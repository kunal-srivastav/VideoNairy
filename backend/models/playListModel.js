const mongoose = require("mongoose");

const playListSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        playlistImage: {
            type: String,
            required: true
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        videos: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Playlist", playListSchema);