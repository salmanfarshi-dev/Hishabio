const express = require("express");
const router = express.Router();

// ====================
// Controllers
// ====================

const {
  createSettlement,getAllSettlements,
} = require("../controllers/settlementController");

const protect = require("../middleware/authMiddleware");

// ====================
// Settlement Routes
// ====================

router.post("/", protect, createSettlement);
router.get("/", protect, getAllSettlements);

module.exports = router;