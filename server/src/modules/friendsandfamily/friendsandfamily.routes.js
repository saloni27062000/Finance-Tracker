const {
  addTransactionController,
  deleteFriendsAndFamilyController,
  updateFriendsAndFamilyController,
  getFriendsAndFamilyByIdController,
  getAllFriendsAndFamilyController,
  createFriendsAndFamilyController,
  updateStatusController,
  receiveAmountController
} = require("./friendsandfamily.controller");

const express = require("express");
const { authenticate } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createFriendsAndFamilyController);
router.get("/", authenticate, getAllFriendsAndFamilyController);
router.get("/:id", authenticate, getFriendsAndFamilyByIdController);
router.put("/:id", authenticate, updateFriendsAndFamilyController);
router.delete("/:id", authenticate, deleteFriendsAndFamilyController);
router.patch("/:id/transaction", authenticate, addTransactionController);
router.patch("/:id/receive/:tid", authenticate, receiveAmountController);
router.patch("/status/:fid/:tid", authenticate, updateStatusController);

module.exports = router;
