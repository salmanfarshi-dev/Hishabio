const express = require("express");
const router = express.Router();

// ====================
// Controller
// ====================

const { getDashboardSummary } = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

// ====================
// Dashboard Routes
// ====================

router.get("/summary", protect, getDashboardSummary);

module.exports = router;
