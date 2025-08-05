const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleWares/isLoggedIn");
const { createPlaylist, addVideoToPlaylist, removeVideoFromPlaylist, updatePlaylist, deletePlaylist, getPlayListById } = require("../controller/playlistContoller");
const upload = require("../middleWares/multer");

router.use(isLoggedIn);

router.post("/create", upload.single("playlistImage"), createPlaylist);

router.get("/:playlistId/add-video/:videoId", addVideoToPlaylist);

router.get("/:playlistId/remove-video/:videoId", removeVideoFromPlaylist);

router.get("/:playlistId", getPlayListById);

router.patch("/update-playlist/:playlistId", upload.single("playlistImage"), updatePlaylist);

router.get("/delete-playlist/:playlistId", deletePlaylist);

module.exports = router