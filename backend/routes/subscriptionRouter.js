const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleWares/isLoggedIn");
const { getAllSubscribedChannel, toggleSubscription } = require("../controller/subscriptionController");
router.use(isLoggedIn);

router.get("/subscribed-channel", getAllSubscribedChannel);

router.post("/toggle/:channelId", toggleSubscription);

module.exports = router;