const Expense = require("../models/Expense");
const Household = require("../models/Household");
const Settlement = require("../models/Settlement");
// ====================
// Add Expense
// ====================

const addExpense = async (req, res) => {
  try {
    const { householdId, title, amount, category, paidBy, date, description } =
      req.body;

    // Check Required Fields
    if (!householdId || !title || !amount || !paidBy) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate Amount
    const totalAmount = Number(amount);

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    // Find Household
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

    // Check Payer Membership
    const payerExists = household.members.some(
      (member) => member.user.toString() === paidBy,
    );

    if (!payerExists) {
      return res.status(400).json({
        success: false,
        message: "Payer must be a household member",
      });
    }

    // Get Household Members
    const memberIds = household.members.map((member) => member.user.toString());

    // Calculate Equal Split in Paisa
    const totalPaisa = Math.round(totalAmount * 100);
    const baseShare = Math.floor(totalPaisa / memberIds.length);
    const remainder = totalPaisa % memberIds.length;

    // Create Participants
    const participants = memberIds.map((userId, index) => ({
      user: userId,
      shareAmount: (baseShare + (index < remainder ? 1 : 0)) / 100,
    }));

    // Create Expense
    const expense = await Expense.create({
      household: householdId,
      title: title.trim(),
      amount: totalAmount,
      category: category || "Others",
      paidBy,
      splitType: "equal",
      participants,
      date: date || Date.now(),
      description: description || "",
      createdBy: req.user.id,
    });

    const savedExpense = await Expense.findById(expense._id)
      .populate("paidBy", "name email")
      .populate("createdBy", "name email")
      .populate("participants.user", "name email profileImage");

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense: savedExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add expense",
      error: error.message,
    });
  }
};

// ====================
// Get All Expenses
// ====================

const getAllExpenses = async (req, res) => {
  try {
    const { householdId } = req.query;

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
    })
      .populate("paidBy", "name email profileImage")
      .populate("participants.user", "name email profileImage")
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      totalExpenses: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get expenses",
      error: error.message,
    });
  }
};

// ====================
// Update Expense
// ====================

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, amount, category, date, description } = req.body;

    // Find expense
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Check household membership
    const household = await Household.findOne({
      _id: expense.household,
      "members.user": req.user.id,
    });

    if (!household) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this expense",
      });
    }

    // Validate amount
    if (amount !== undefined) {
      const updatedAmount = Number(amount);

      if (!Number.isFinite(updatedAmount) || updatedAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than zero",
        });
      }

      expense.amount = updatedAmount;

      // Update equal split shares
      if (expense.splitType === "equal" && expense.participants.length > 0) {
        const totalPaisa = Math.round(updatedAmount * 100);

        const memberCount = expense.participants.length;

        const baseShare = Math.floor(totalPaisa / memberCount);

        const remainder = totalPaisa % memberCount;

        expense.participants.forEach((participant, index) => {
          participant.shareAmount =
            (baseShare + (index < remainder ? 1 : 0)) / 100;
        });
      }
    }
    // Update fields
    if (title !== undefined) expense.title = title;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    if (description !== undefined) expense.description = description;

    await expense.save();

    const updatedExpense = await Expense.findById(id)
      .populate("paidBy", "name email profileImage")
      .populate("participants.user", "name email profileImage")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update expense",
      error: error.message,
    });
  }
};

// ====================
// Delete Expense
// ====================

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Find expense
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Check household membership
    const household = await Household.findOne({
      _id: expense.household,
      "members.user": req.user.id,
    });

    if (!household) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this expense",
      });
    }

    // Delete expense
    await Expense.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
      error: error.message,
    });
  }
};

// ====================
// Get Household Balances
// ====================

const getHouseholdBalances = async (req, res) => {
  try {
    const { householdId } = req.query;

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
    }).populate("members.user", "name email profileImage");

    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Household not found or you are not a member",
      });
    }

    // Get all household expenses
    const expenses = await Expense.find({
      household: householdId,
    });

    // Get all household settlements
    const settlements = await Settlement.find({
      household: householdId,
    });

    // Calculate member balances
    const balances = household.members.map((member) => {
      const user = member.user;

      let totalPaid = 0;
      let totalShare = 0;

      expenses.forEach((expense) => {
        // Calculate total amount paid by this member
        if (expense.paidBy.toString() === user._id.toString()) {
          totalPaid += expense.amount;
        }

        // Calculate total share of this member
        expense.participants.forEach((participant) => {
          if (participant.user.toString() === user._id.toString()) {
            totalShare += participant.shareAmount;
          }
        });
      });

      // Calculate final balance
      // Calculate expense balance
      let balance = totalPaid - totalShare;

      // Adjust balance using settlements
      settlements.forEach((settlement) => {
        // Person who paid gets a positive adjustment
        if (settlement.paidBy.toString() === user._id.toString()) {
          balance += settlement.amount;
        }

        // Person who received gets a negative adjustment
        if (settlement.receivedBy.toString() === user._id.toString()) {
          balance -= settlement.amount;
        }
      });

      // Final balance
      balance = Number(balance.toFixed(2));

      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        },
        totalPaid: Number(totalPaid.toFixed(2)),
        totalShare: Number(totalShare.toFixed(2)),
        balance,
      };
    });

    res.status(200).json({
      success: true,
      household: household.name,
      balances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate balances",
      error: error.message,
    });
  }
};
module.exports = {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getHouseholdBalances,
};
