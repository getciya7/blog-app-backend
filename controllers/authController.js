const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const registerUser = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const userExistsByUsername = await User.findOne({ username });
    if (userExistsByUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    const user = await User.create({
      email,
      username,
      password,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "Blog App",
      to: user.email,
      subject: "Account Activation",
      text: `Click on this link to activate your account:  ${
        process.env.CLIENT_URL
      }/activate/${generateToken(user._id)}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      message: "Registration Successful. Check email for activation",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const activateUser = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({ message: "Account activated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(400).json({ message: "Account is not activated" });
      }
      const token = generateToken(user._id);

      // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true, // Ensures the cookie is sent only in HTTP requests, not accessible via JavaScript
        secure: true, // Ensures the cookie is sent only over HTTPS in production
        sameSite: "none", // Helps prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days in this case)
      });
      res.json({
        _id: user._id,
        email: user.email,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateToken(user._id);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "URL Shortener",
      to: user.email,
      subject: "Password Reset",
      text: `Click on this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const logout = async (req, res) => {
  try {
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .send("User logged out successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
};

const refetch = async (req, res) => {
  // Retrieve the token from cookies
  const token = req.cookies.token;

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the ID from the token
    const user = await User.findById(decoded.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user details as response
    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    // Handle errors such as invalid or expired tokens
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  registerUser,
  activateUser,
  authUser,
  forgotPassword,
  resetPassword,
  logout,
  refetch,
};
