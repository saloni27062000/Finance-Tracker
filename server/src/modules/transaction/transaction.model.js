const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
    },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: [true, "Bank ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      default: 0,
    },
    type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: ["income", "expense"],
      default: "expense",
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const TransactionModel = mongoose.model("Transaction", transactionSchema);
module.exports = TransactionModel;
