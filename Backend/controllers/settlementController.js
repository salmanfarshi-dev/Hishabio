const Settlement = require("../models/Settlement");
const Household = require("../models/Household");

// ====================
// Create Settlement
// ====================

const createSettlement = async (req, res) => {
  try {
    const { householdId, receivedBy, amount, date, note } = req.body;

    // Check required fields
    if (!householdId || !receivedBy || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate amount
    const totalAmount = Number(amount);

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
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

    // Check receiver membership
    const receiverExists = household.members.some(
      (member) => member.user.toString() === receivedBy,
    );

    if (!receiverExists) {
      return res.status(400).json({
        success: false,
        message: "Receiver must be a household member",
      });
    }

    // Prevent sending settlement to yourself
    if (req.user.id === receivedBy) {
      return res.status(400).json({
        success: false,
        message: "You cannot settle with yourself",
      });
    }

    // Create settlement
    const settlement = await Settlement.create({
      household: householdId,
      paidBy: req.user.id,
      receivedBy,
      amount: totalAmount,
      date: date || Date.now(),
      note: note || "",
    });

    // Get populated settlement
    const savedSettlement = await Settlement.findById(settlement._id)
      .populate("paidBy", "name email profileImage")
      .populate("receivedBy", "name email profileImage");

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

    // Get all settlements
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
  createSettlement,getAllSettlements,
};
