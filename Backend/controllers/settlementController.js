const Settlement = require("../models/Settlement");
const Household = require("../models/Household");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");
const createNotification = require("../utils/createNotification");

// ====================
// Create Settlement
// ====================

const createSettlement = async (req, res) => {
  try {
    const { householdId, receivedBy, amount, date, note } = req.body;

    if (!householdId || !receivedBy || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(householdId) ||
      !mongoose.Types.ObjectId.isValid(receivedBy)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid household or receiver ID",
      });
    }

    const totalAmount = Number(amount);

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    // Current user must be an active household member
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

    if (req.user.id === receivedBy) {
      return res.status(400).json({
        success: false,
        message: "You cannot settle with yourself",
      });
    }

    // Receiver can be an active OR historical household member.
    // Check whether the receiver participated in any old expense.
    const receiverInExpense = await Expense.exists({
      household: householdId,
      $or: [{ paidBy: receivedBy }, { "participants.user": receivedBy }],
    });

    // Also check previous settlements
    const receiverInSettlement = await Settlement.exists({
      household: householdId,
      $or: [{ paidBy: receivedBy }, { receivedBy: receivedBy }],
    });

    const isActiveReceiver = household.members.some(
      (member) => member.user.toString() === receivedBy,
    );

    if (!isActiveReceiver && !receiverInExpense && !receiverInSettlement) {
      return res.status(400).json({
        success: false,
        message: "Receiver is not associated with this household",
      });
    }

    const settlement = await Settlement.create({
      household: householdId,
      paidBy: req.user.id,
      receivedBy,
      amount: Math.round(totalAmount * 100) / 100,
      date: date || Date.now(),
      note: note || "",
    });

    const savedSettlement = await Settlement.findById(settlement._id)
      .populate("paidBy", "name email profileImage")
      .populate("receivedBy", "name email profileImage");
    await createNotification({
      household,
      senderId: req.user.id,
      title: "New Settlement",
      message: `A payment of ৳${totalAmount} was sent to ${savedSettlement.receivedBy.name}.`,
      type: "settlement",
      relatedId: settlement._id,
    });
    res.status(201).json({
      success: true,
      message: "Settlement recorded successfully",
      settlement: savedSettlement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record settlement",
      error: error.message,
    });
  }
};

// ====================
// Get All Settlements
// ====================

const getAllSettlements = async (req, res) => {
  try {
    const { householdId } = req.query;

    if (!householdId) {
      return res.status(400).json({
        success: false,
        message: "Household ID is required",
      });
    }

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

    const settlements = await Settlement.find({
      household: householdId,
    })
      .populate("paidBy", "name email profileImage")
      .populate("receivedBy", "name email profileImage")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      totalSettlements: settlements.length,
      settlements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get settlements",
      error: error.message,
    });
  }
};

module.exports = {
  createSettlement,
  getAllSettlements,
};
