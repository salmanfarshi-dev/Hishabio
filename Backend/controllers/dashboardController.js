
const Household = require("../models/Household");
const Expense = require("../models/Expense");
const Settlement = require("../models/Settlement");

// ====================
// Get Dashboard Summary
// ====================

const getDashboardSummary = async (req, res) => {
  try {
    const { householdId } = req.query;

    // Check household ID
    if (!householdId) {
      return res.status(400).json({
        success: false,
        message: "Household ID is required",
      });
    }

    // Check household membership
    const household = await Household.findOne({
      _id: householdId,
      "members.user": req.user.id,
    });

    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Household not found or you are not a member",
      });
    }

    // Get all expenses
    const expenses = await Expense.find({
      household: householdId,
    });

    // Get all settlements
    const settlements = await Settlement.find({
      household: householdId,
    });

    // Calculate total expenses
    const totalSpent = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    // Calculate current month expenses
    const now = new Date();

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      return expenseDate >= monthStart && expenseDate < monthEnd;
    });

    const monthlySpent = monthlyExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    // ====================
    // Calculate Monthly Chart Data
    // ====================

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlyChartData = monthNames.map((month, index) => {
      const monthTotal = expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);

          return (
            expenseDate.getFullYear() === now.getFullYear() &&
            expenseDate.getMonth() === index
          );
        })
        .reduce((total, expense) => total + expense.amount, 0);

      return {
        month,
        expense: Number(monthTotal.toFixed(2)),
      };
    });

    // ====================
    // Get Recent Expenses
    // ====================

    const recentExpenses = await Expense.find({
      household: householdId,
    })
      .populate("paidBy", "name email profileImage")
      .sort({ date: -1 })
      .limit(5);

    // Calculate total settlements
    const totalSettled = settlements.reduce(
      (total, settlement) => total + settlement.amount,
      0
    );

    // ====================
    // Dashboard Response
    // ====================

    res.status(200).json({
      success: true,
      dashboard: {
        householdName: household.name,
        totalMembers: household.members.length,
        totalExpenses: expenses.length,
        totalSpent: Number(totalSpent.toFixed(2)),
        monthlySpent: Number(monthlySpent.toFixed(2)),
        totalSettlements: settlements.length,
        totalSettled: Number(totalSettled.toFixed(2)),
        monthlyExpenses: monthlyChartData,
        recentExpenses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard summary",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};
