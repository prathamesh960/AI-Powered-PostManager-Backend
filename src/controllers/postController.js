const mongoose = require("mongoose");

const Post = require("../models/Post");
const Location = require("../models/Location");

const POST_TYPES = ["Update", "Event", "Offer", "Product"];
const CTA_TYPES = [
  "Book",
  "Call",
  "Learn More",
  "Order",
  "Sign Up",
  "Get Offer",
  "None"
];
const STATUSES = ["draft", "published"];

function formatPost(post) {
  const data = post.toObject();

  return {
    ...data,
    location: data.locationId,
    locationId: undefined
  };
}

async function listPosts(req, res) {
  try {
    const { status, search } = req.query;

    const query = {
      userId: req.userId
    };

    if (status) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({
          message: "Invalid status."
        });
      }

      query.status = status;
    }

    if (search?.trim()) {
      const value = search.trim();

      query.$or = [
        {
          topic: {
            $regex: value,
            $options: "i"
          }
        },
        {
          content: {
            $regex: value,
            $options: "i"
          }
        }
      ];
    }

    const posts = await Post.find(query)
      .populate("locationId")
      .sort({ updatedAt: -1 });

    res.json({
      posts: posts.map(formatPost)
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load posts."
    });
  }
}

async function getPost(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid post id."
      });
    }

    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate("locationId");

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      });
    }

    res.json({
      post: formatPost(post)
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load post."
    });
  }
}

async function createPost(req, res) {
  try {
    const {
      locationId,
      topic,
      postType,
      tone,
      language,
      cta,
      content,
      status
    } = req.body;

    if (!locationId || !topic?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "Location, topic and content are required."
      });
    }

    if (!POST_TYPES.includes(postType)) {
      return res.status(400).json({
        message: "Invalid post type."
      });
    }

    if (!CTA_TYPES.includes(cta)) {
      return res.status(400).json({
        message: "Invalid CTA."
      });
    }

    if (!STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid status."
      });
    }

    const location = await Location.findOne({
      _id: locationId,
      userId: req.userId
    });

    if (!location) {
      return res.status(404).json({
        message: "Location not found."
      });
    }

    const post = await Post.create({
      userId: req.userId,
      locationId,
      topic: topic.trim(),
      postType,
      tone,
      language,
      cta,
      content: content.trim(),
      status
    });

    await post.populate("locationId");

    res.status(201).json({
      post: formatPost(post)
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create post."
    });
  }
}

async function updatePost(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid post id."
      });
    }

    const {
      locationId,
      topic,
      postType,
      tone,
      language,
      cta,
      content
    } = req.body;

    if (!locationId || !topic?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "Location, topic and content are required."
      });
    }

    const location = await Location.findOne({
      _id: locationId,
      userId: req.userId
    });

    if (!location) {
      return res.status(404).json({
        message: "Location not found."
      });
    }

    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId
      },
      {
        locationId,
        topic: topic.trim(),
        postType,
        tone,
        language,
        cta,
        content: content.trim()
      },
      {
        new: true,
        runValidators: true
      }
    ).populate("locationId");

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      });
    }

    res.json({
      post: formatPost(post)
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update post."
    });
  }
}

async function deletePost(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid post id."
      });
    }

    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      });
    }

    res.json({
      message: "Post deleted successfully."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to delete post."
    });
  }
}

async function publishPost(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid post id."
      });
    }

    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      });
    }

    if (!post.content?.trim()) {
      return res.status(400).json({
        message: "Cannot publish an empty post."
      });
    }

    post.status = "published";

    await post.save();
    await post.populate("locationId");

    res.json({
      post: formatPost(post)
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to publish post."
    });
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  publishPost
};