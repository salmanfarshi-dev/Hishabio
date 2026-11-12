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

module.exports = { createHousehold };
