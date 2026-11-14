const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyEmail,
  loginUser,
  getMe,
  updateProfile,
  updateProfileImage,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ====================
// Authentication Routes
// ====================

// Register and Send OTP
router.post("/register", registerUser);

// Verify Email OTP
router.post("/verify-email", verifyEmail);

// Login
router.post("/login", loginUser);

// ====================
// Protected Routes
// ====================

router.get("/me", protect, getMe);

router.put("/profile", protect, updateProfile);

router.put(
  "/profile/image",
  protect,
  upload.single("profileImage"),
  updateProfileImage,
);

module.exports = router;
