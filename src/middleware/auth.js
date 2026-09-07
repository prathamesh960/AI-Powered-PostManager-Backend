const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    const token = req.cookies.gbp_token;
    if (!token) return res.status(401).json({ message: "Unauthorized. Please login." });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized. Session expired or invalid." });
  }
}

module.exports = { requireAuth };
