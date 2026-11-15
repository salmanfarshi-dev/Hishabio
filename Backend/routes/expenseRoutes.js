
const express = require("express");

const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getHouseholdBalances,
  cleanupExpenseParticipants,
} = require("../controllers/expenseController");

const protect = require("../middleware/authMiddleware");

// Expense Routes
router.post("/", protect, addExpense);
router.get("/", protect, getAllExpenses);
router.get("/balances", protect, getHouseholdBalances);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

// Cleanup invalid participants
router.patch("/:id/cleanup-participants", protect, cleanupExpenseParticipants);

module.exports = router;
