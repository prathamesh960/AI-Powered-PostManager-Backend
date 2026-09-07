const jwt = require("jsonwebtoken");

function setAuthCookie(res, userId) {
  const token = jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("gbp_token", token, {
    httpOnly: true,
    sameSite: process.env.COOKIE_SAME_SITE || "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function clearAuthCookie(res) {
  res.clearCookie("gbp_token", {
    httpOnly: true,
    sameSite: process.env.COOKIE_SAME_SITE || "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

module.exports = {
  setAuthCookie,
  clearAuthCookie
};