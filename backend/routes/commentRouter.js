const express = require("express");
const { getVideoComments, addComment, updateComment, deleteComment, getPostComments } = require("../controller/getCommentController");
const { isLoggedIn } = require("../middleWares/isLoggedIn");
const router = express.Router();
router.use(isLoggedIn);

router.get("/video/:videoId", getVideoComments);

router.get("/post/:postId", getPostComments)

router.post("/video/:videoId/add-comment", addComment);

router.post("/post/:postId/add-comment", addComment);

router.patch("/update-comment/:commentId", updateComment);

router.get("/delete-comment/:commentId", deleteComment);

module.exports = router;