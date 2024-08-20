// routes/posts.js
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const verifyToken = require("../verifyToken");
const cloudinary = require("../cloudinaryConfig");
const upload = require("../multerCloudinary"); // Import multer configuration

// CREATE POST WITH IMAGE
router.post("/create", verifyToken, async (req, res) => {
  const { title, desc, username, userId, categories, photo } = req.body;

  // Check if photo URL is received
  if (!photo) {
    return res.status(400).json({ error: "Photo URL is missing" });
  }

  const newPost = new Post({
    title,
    desc,
    username,
    userId,
    categories,
    photo, // Save the photo URL here
  });

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).json({ error: "Error saving post" });
  }
});

// UPDATE POST
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE POST
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });
    res.status(200).json("Post has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POST DETAILS
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POSTS
router.get("/", async (req, res) => {
  const query = req.query;

  try {
    const searchFilter = {
      title: { $regex: query.search, $options: "i" },
    };
    const posts = await Post.find(query.search ? searchFilter : null);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER POSTS
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LIKE A POST
router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }

    // Add user ID to likes
    post.likes.push(req.user._id);
    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id/unlike", verifyToken, async (req, res) => {
  try {
    // Find the post by ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if the user has liked the post
    if (!post.likes.some((userId) => userId.equals(req.user._id))) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    // Remove the user ID from the likes array
    post.likes = post.likes.filter((userId) => !userId.equals(req.user._id));

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (err) {
    console.error("Error unliking post:", err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
