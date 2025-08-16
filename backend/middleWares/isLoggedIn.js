const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports.isLoggedIn = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    return res.status(401).json("Unauthorized request");
  }

  try {
    // Verify access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await userModel.findOne({ email: decoded.email }).select("-password -refreshToken");
    req.user = user;
    return next();
  } catch (err) {
    // Access token expired, try refresh token
    if (!refreshToken) {
      return res.status(401).json("Session expired. Please login");
    }

    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      console.log(decodedRefresh);
      const user = await userModel.findOne({ email: decodedRefresh.email }).select("-password -refreshToken");
      console.log("User", user);
      console.log("refresh token", refreshToken);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json("Refresh token invalid or expired");
      }
      req.user = user;
      return next();
    } catch (refreshErr) {
      return res.status(403).json("Session expired. Please login");
    }
  }
};
