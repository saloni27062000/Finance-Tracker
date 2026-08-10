const mongoose = require("mongoose");

const investmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Investment name is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      default: 0,
    },
    returnAmt: {
      type: Number,
      default: 0,
    },
    isProfit: {
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

const InvestmentModel = mongoose.model("Investment", investmentSchema);
module.exports = InvestmentModel;
