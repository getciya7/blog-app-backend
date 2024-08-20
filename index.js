const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const cloudinary = require("./cloudinaryConfig");
const upload = require("./multerCloudinary");

// Load environment variables
dotenv.config();

// Connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database is connected successfully!");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit process with failure
  }
};

// Middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploaded file info:", req.file);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
      resource_type: "auto",
    });

    console.log("Cloudinary response:", result);

    if (!result || !result.secure_url) {
      return res.status(500).json({ error: "Failed to upload to Cloudinary" });
    }

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ error: "Error uploading file" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log("App is running on port " + PORT);
});
