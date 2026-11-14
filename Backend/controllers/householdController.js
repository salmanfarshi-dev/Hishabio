const Household = require("../models/Household");
const crypto = require("crypto");

// Create Household

const createHousehold = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check Household Name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Household name is required",
      });
    }

    // Generate Unique Invite Code
    const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Create Household
    const household = await Household.create({
      name: name.trim(),
      description: description || "",
      createdBy: req.user.id,
      members: [
        {
          user: req.user.id,
          role: "admin",
        },
      ],
      inviteCode,
    });

    res.status(201).json({
      success: true,
      message: "Household created successfully",
      household,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create household",
      error: error.message,
    });
  }
};

// ====================
// Get My Households
// ====================

const getMyHouseholds = async (req, res) => {
  try {
    const households = await Household.find({
      "members.user": req.user.id,
    })
      .populate("createdBy", "name email")
      .populate("members.user", "name email profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: households.length,
      households,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get households",
      error: error.message,
    });
  }
};

// ====================
// Join Household
// ====================

const joinHousehold = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    // Check Invite Code
    if (!inviteCode || !inviteCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invite code is required",
      });
    }

    // Find Household
    const household = await Household.findOne({
      inviteCode: inviteCode.trim().toUpperCase(),
    });

    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite code",
      });
    }

    // Check Existing Member
    const alreadyMember = household.members.some(
      (member) => member.user.toString() === req.user.id,
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "You are already a member of this household",
      });
    }

    // Add New Member
    household.members.push({
      user: req.user.id,
      role: "member",
    });

    await household.save();

    res.status(200).json({
      success: true,
      message: "Joined household successfully",
      household,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to join household",
      error: error.message,
    });
  }
};

const getHouseholdDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find Household Only If User Is A Member
    const household = await Household.findOne({
      _id: id,
      "members.user": req.user.id,
    })
      .populate("createdBy", "name email")
      .populate("members.user", "name email profileImage");

    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Household not found or you are not a member",
      });
    }

    res.status(200).json({
      success: true,
      household,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get household details",
      error: error.message,
    });
  }
};

// ====================
// Remove Household Member
// ====================

const removeHouseholdMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    // Find household
    const household = await Household.findById(id);

    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Household not found",
      });
    }

    // Check current user is an admin
    const currentMember = household.members.find(
      (member) => member.user.toString() === req.user.id
    );

    if (!currentMember || currentMember.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only household admins can remove members",
      });
    }

    // Prevent removing household creator
    if (household.createdBy.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: "Household creator cannot be removed",
      });
    }

    // Prevent admin from removing themselves
    if (req.user.id === memberId) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove yourself",
      });
    }

    // Check target member exists
    const memberExists = household.members.some(
      (member) => member.user.toString() === memberId
    );

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: "Member not found in this household",
      });
    }

    // Remove member
    household.members = household.members.filter(
      (member) => member.user.toString() !== memberId
    );

    await household.save();

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove member",
      error: error.message,
    });
  }
};

// ====================
// Get Household Members
// ====================

const getHouseholdMembers = async (req, res) => {
  try {
    const { id } = req.params;

    // Check household membership
    const household = await Household.findOne({
      _id: id,
      "members.user": req.user.id,
    }).populate("members.user", "name email profileImage");

    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Household not found or you are not a member",
      });
    }

    // Get members
    const members = household.members.map((member) => ({
      user: member.user,
      role: member.role,
      joinedAt: member.joinedAt,
    }));

    res.status(200).json({
      success: true,
      totalMembers: members.length,
      members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get household members",
      error: error.message,
    });
  }
};

module.exports = {
  createHousehold,
  getMyHouseholds,
  joinHousehold,
  getHouseholdDetails, removeHouseholdMember, getHouseholdMembers,
};
