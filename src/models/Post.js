const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },

    topic: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    postType: {
      type: String,
      enum: ["Update", "Event", "Offer", "Product"],
      default: "Update"
    },

    tone: {
      type: String,
      enum: ["Professional", "Friendly", "Promotional", "Warm"],
      default: "Professional"
    },

    language: {
      type: String,
      enum: ["English", "Hindi", "Marathi"],
      default: "English"
    },

    cta: {
      type: String,
      enum: [
        "Book",
        "Call",
        "Learn More",
        "Order",
        "Sign Up",
        "Get Offer",
        "None"
      ],
      default: "None"
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("Post", postSchema);