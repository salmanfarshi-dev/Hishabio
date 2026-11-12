const mongoose = require("mongoose");

// ====================
// Household Schema
// ====================

const householdSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Household name is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    inviteCode: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Export Household Model


const Household = mongoose.model("Household", householdSchema);

module.exports = Household;
