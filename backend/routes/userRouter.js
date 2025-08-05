const express = require("express");
const { registerUser, loginUser, refreshToken, logOut, changeCurrentPassword, getCurrentUser, updateAcountDetails, updateImage, avatarImageUpdate, coverImageUpdate, getUserChannelProfile, getWatchHistory, videoUpload, updateUserImage } = require("../controller/authController");
const upload = require("../middleWares/multer");
const { isLoggedIn } = require("../middleWares/isLoggedIn");
const router = express.Router();

router.post("/register", upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]) ,registerUser);

router.post("/login", loginUser);

router.get("/logout", isLoggedIn, logOut);

router.post("/refresh-token", refreshToken);

router.post("/change-password", isLoggedIn, changeCurrentPassword);

router.get("/current-user", isLoggedIn, getCurrentUser);

router.patch("/update-detail", isLoggedIn, updateAcountDetails);

router.patch("/update-image/:type", upload.single("image"), isLoggedIn, updateUserImage);  

router.get("/profile/:userName", isLoggedIn, getUserChannelProfile);

router.get("/watch-history", isLoggedIn, getWatchHistory);

module.exports = router;