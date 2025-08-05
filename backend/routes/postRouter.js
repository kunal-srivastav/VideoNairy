const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleWares/isLoggedIn");
const { createUserPost, updateUserPost, deleteUserPost } = require("../controller/postController");
const upload = require("../middleWares/multer");
router.use(isLoggedIn);

router.post("/create", upload.single("postImage"), createUserPost);

router.patch("/update/:postId", upload.single("postImage"), updateUserPost);

router.get("/delete/:postId", deleteUserPost);

module.exports = router;