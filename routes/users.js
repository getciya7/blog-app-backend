const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs"); // Changed to bcryptjs
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const verifyToken = require("../verifyToken");

// update
router.put("/:id", verifyToken, async (req, res) => {
  try {
    // Check if the email is being updated
    if (req.body.email) {
      const existingUser = await User.findOne({ email: req.body.email });

      // If an existing user is found and it's not the current user, return an error
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res
          .status(400)
          .json({ message: "Email already exists, Try another email" });
      }
    }

    // Hash the password if it's being updated
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      req.body.password = await bcryptjs.hash(req.body.password, salt);
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found!");
    }

    // Check if the password was sent in the request
    if (!req.body.password) {
      return res.status(400).json("Password is required!");
    }

    // Validate the password
    const isPasswordValid = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json("Incorrect password!");
    }

    await User.findByIdAndDelete(req.params.id);
    await Post.deleteMany({ userId: req.params.id });
    await Comment.deleteMany({ userId: req.params.id });

    res.status(200).json("User has been deleted!");
  } catch (err) {
    console.error(err); // Log the actual error for debugging
    res.status(500).json("An error occurred while deleting the user.");
  }
});

// GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
