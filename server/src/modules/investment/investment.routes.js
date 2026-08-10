const express = require('express');
const router = express.Router();
const {
    createInvestmentController,
    getAllInvestmentController,
    getInvestmentByIdController,
    updateInvestmentController,
    deleteInvestmentController,
    receiveInvestmentReturnController,
} = require("./investment.controller");
const {authenticate} = require("../../middleware/auth.middleware");

router.post("/", authenticate, createInvestmentController);
router.get("/", authenticate, getAllInvestmentController);
router.get("/:id", authenticate, getInvestmentByIdController);
router.put("/:id", authenticate, updateInvestmentController);
router.delete("/:id", authenticate, deleteInvestmentController);
router.patch("/:id/return", authenticate, receiveInvestmentReturnController);

module.exports = router;