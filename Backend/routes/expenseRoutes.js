const express = require("express");

const router = express.Router();

const { addExpense,getAllExpenses, updateExpense,
  deleteExpense,getHouseholdBalances } = require("../controllers/expenseController");

const protect = require("../middleware/authMiddleware");

// ====================
// Expense Routes
// ====================

router.post("/", protect, addExpense);
router.get("/", protect, getAllExpenses);
router.get("/balances", protect, getHouseholdBalances);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);



module.exports = router;
