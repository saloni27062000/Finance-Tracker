const mongoose = require("mongoose");

const bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Bank name is required"],
    },
    balance: {
      type: Number,
      required: [true, "Balance is required"],
      default: 0,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
  },
);

const BankModel = mongoose.model("Bank", bankSchema);
module.exports = BankModel;
