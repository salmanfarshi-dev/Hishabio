
const express = require("express");

const router = express.Router();

const {
  createHousehold,
  getMyHouseholds,  joinHousehold,getHouseholdDetails
} = require("../controllers/householdController");

const protect = require("../middleware/authMiddleware");

// ====================
// Household Routes
// ====================

router.post("/", protect, createHousehold);
router.get("/my-households", protect, getMyHouseholds);
router.post("/join", protect, joinHousehold);
router.get("/:id", protect, getHouseholdDetails);

module.exports = router;
