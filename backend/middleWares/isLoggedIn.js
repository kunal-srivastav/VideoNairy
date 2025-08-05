const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports.isLoggedIn = async (req, res, next) => {
    const {accessToken, refreshToken} = req.cookies;
    if(!(req.cookies.accessToken || req.cookies.refreshToken)) return res.status(401).json("Unauthorized request");
    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await userModel.findOne({email: decodedToken.email}).select("-password -refreshToken");
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json("Session is expired. Please login");
    }
}