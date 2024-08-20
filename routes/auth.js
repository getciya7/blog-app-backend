const express = require("express");
const {
  registerUser,
  activateUser,
  authUser,
  forgotPassword,
  resetPassword,
  logout,
  refetch,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/activate/:token", activateUser);
router.post("/login", authUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/logout", logout);
router.get("/refetch", refetch);

module.exports = router;
