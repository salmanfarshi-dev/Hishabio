const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema(
  {
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Settlement amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["completed"],
      default: "completed",
    },
  },
  { timestamps: true },
);

const Settlement = mongoose.model("Settlement", settlementSchema);

module.exports = Settlement;
