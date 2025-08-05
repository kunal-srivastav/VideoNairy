const jwt = require("jsonwebtoken");

module.exports.generateAccessAndRefreshToken = async(user) => {
   try {
     const accessToken = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
     const refreshToken = jwt.sign({email: user.email}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
     user.refreshToken = refreshToken;
     await user.save();
     return {accessToken, refreshToken};
   } catch (error) {
        return res.status(500).json("Something went wrong while generating access and refresh token");
   }
}