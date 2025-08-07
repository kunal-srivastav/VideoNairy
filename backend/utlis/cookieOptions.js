
const isProduction = process.env.NODE_ENV === "production";

module.exports.cookieOptions = {
  accessToken: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "None",
    maxAge: 30 * 60 * 1000, // 30 minutes
  },
  refreshToken: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }
};