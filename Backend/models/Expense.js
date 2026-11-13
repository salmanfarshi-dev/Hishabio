const mongoose = require("mongoose");

// ====================
// Expense Schema
// ====================

const expenseSchema = new mongoose.Schema(
  {
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },

    category: {
      type: String,
      enum: [
        "Food",
        "Transport",
        "Shopping",
        "Utilities",
        "Rent",
        "Entertainment",
        "Others",
      ],
      default: "Others",
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    splitType: {
      type: String,
      enum: ["equal", "custom"],
      default: "equal",
    },

    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        shareAmount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    date: {
      type: Date,
      default: Date.now,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// ====================
// Export Expense Model
// ====================

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
