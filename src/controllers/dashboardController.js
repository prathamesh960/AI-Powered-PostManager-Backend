const Location = require("../models/Location");
const Post = require("../models/Post");

async function dashboard(req, res) {
  try {
    const userId = req.userId;

    const totalLocations = await Location.countDocuments({
      userId
    });

    const totalPosts = await Post.countDocuments({
      userId
    });

    const drafts = await Post.countDocuments({
      userId,
      status: "draft"
    });

    const published = await Post.countDocuments({
      userId,
      status: "published"
    });

    const posts = await Post.find({
      userId
    })
      .populate("locationId")
      .sort({ updatedAt: -1 })
      .limit(8);

    const recentPosts = posts.map(post => ({
      ...post.toObject(),
      location: post.locationId,
      locationId: undefined
    }));

    res.json({
      stats: {
        totalLocations,
        totalPosts,
        drafts,
        published
      },
      recentPosts
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load dashboard."
    });
  }
}

module.exports = {
  dashboard
};