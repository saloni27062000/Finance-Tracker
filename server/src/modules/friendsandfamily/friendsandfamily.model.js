const mongoose = require("mongoose");

const transactionofFAFSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      default: 0,
    },
    issuedDate: {
      type: Date,
      required: [true, "Issued date is required"],
      default: Date.now,
    },
    returnDate: {
      type: Date,
      required: [true, "Return date is required"],
    },
    status: {
      type: String,
      enum: ["pending", "returned"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const friendsAndFamilySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    transactions: [transactionofFAFSchema],
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

const FriendsAndFamilyModel = mongoose.model(
  "FriendsAndFamily",
  friendsAndFamilySchema,
);
module.exports = FriendsAndFamilyModel;
