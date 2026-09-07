const Location = require("../models/Location");

async function listLocations(req, res) {
  const locations = await Location.find({ userId: req.userId }).sort({ businessName: 1 });
  res.json({ locations });
}

module.exports = { listLocations };
