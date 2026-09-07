const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { listLocations } = require("../controllers/locationController");

const router = express.Router();
router.get("/", requireAuth, listLocations);

module.exports = router;
