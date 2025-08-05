const express = require("express");
const { videoUpload, getVideoById, updateVideo, deleteVideo, getAllVideos, getAllUserVideos } = require("../controller/videoController");
const { isLoggedIn } = require("../middleWares/isLoggedIn");
const upload = require("../middleWares/multer");
const router = express.Router();

router.post("/upload", isLoggedIn ,upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), videoUpload);

router.get("/getAllVideos", getAllVideos);

router.get("/video/:videoId", isLoggedIn, getVideoById);

router.patch("/update-video/:videoId", isLoggedIn, upload.single("thumbnail"), updateVideo);

router.get("/delete-video/:videoId", isLoggedIn, deleteVideo);

module.exports = router;