const express = require("express");

const { requireAuth } = require("../middleware/auth");

const {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  publishPost
} = require("../controllers/postController");

const router = express.Router();

router.use(requireAuth);

router.get("/", listPosts);
router.get("/:id", getPost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/publish", publishPost);

module.exports = router;