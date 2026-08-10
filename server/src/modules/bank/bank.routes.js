const express = require("express");
const router = express.Router();
const {
  createBankController,
  getAllBanksController,
  getBankByIdController,
  updateBankController,
  deleteBankController,
} = require("./bank.controller");
const { authenticate } = require("../../middleware/auth.middleware");


router.post("/", authenticate, createBankController);
router.get("/", authenticate, getAllBanksController);
router.get("/:id", authenticate, getBankByIdController);
router.put("/:id", authenticate, updateBankController);
router.delete("/:id", authenticate, deleteBankController);

module.exports = router;
