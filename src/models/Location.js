const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  businessName: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model("Location", locationSchema);

