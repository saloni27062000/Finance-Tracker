const express = require('express');
const router = express.Router();
const { authenticate } = require("../../middleware/auth.middleware");
const {
  createTransactionController,
  getAllTransactionsController,
  getTransactionByIdController,
  updateTransactionController,
  deleteTransactionController,
} = require("./transaction.controller");

router.post("/", authenticate, createTransactionController);
router.get("/", authenticate, getAllTransactionsController);
router.get("/:id", authenticate, getTransactionByIdController);
router.put("/:id", authenticate, updateTransactionController);
router.delete("/:id", authenticate, deleteTransactionController);

module.exports = router;