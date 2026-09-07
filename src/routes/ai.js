const express = require("express");

const { requireAuth } = require("../middleware/auth");
const { generateContent } = require("../controllers/aiController");

const router = express.Router();

router.post(
  "/generate",
  requireAuth,
  generateContent
);

module.exports = router;