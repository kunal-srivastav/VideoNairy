const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleWares/isLoggedIn");
const { toggleVideoLike, toggleCommentLike, togglePostLike, getLikedVideo } = require("../controller/likeController");

router.use(isLoggedIn);

router.get("/video/:videoId", toggleVideoLike);

router.get("/comment/:commentId", toggleCommentLike);

router.get("/post/:postId", togglePostLike);

router.get("/videos", getLikedVideo);

module.exports = router;