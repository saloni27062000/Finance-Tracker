const {
  getSelectedBankIdService,
  updateBankBalanceService,
} = require("../bank/bank.service");
const {
  getInvestmentByNameService,
  createInvestmentService,
  getAllInvestmentService,
  getInvestmentByIdService,
  updateInvestmentService,
  deleteInvestmentService,
  receiveInvestmentReturnService,
  updateInvestmentBalanceService,
} = require("./investment.service");

module.exports.createInvestmentController = async (req, res, next) => {
  try {
    const InvestmentData = req.body;
    const userId = req.user._id;
    InvestmentData.userId = userId;
    const existingInvestment = await getInvestmentByNameService(
      InvestmentData.name,
    );
    if (existingInvestment) {
      return res.status(400).json({
        message: "Investment with this name already exists",
      });
    }
    const selectedBank = await getSelectedBankIdService(userId);
    if (!selectedBank) {
      return res.status(404).json({ message: "Selected bank not found" });
    }
    const amount = -Number(InvestmentData.amount);
    const bankData = await updateBankBalanceService(
      String(selectedBank._id),
      amount,
    );
    const newInvestment = await createInvestmentService(InvestmentData);
    res.status(201).json({
      message: "Investment created successfully",
      data: newInvestment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.receiveInvestmentReturnController = async (req, res, next) => {
  try {
    const InvestmentId = req.params.id;
    const { returnAmt, isProfit } = req.body;
    if (returnAmt == null || Number(returnAmt) <= 0) {
      return res.status(400).json({
        message: "Valid returnAmt is required",
      });
    }

    const investment = await getInvestmentByIdService(InvestmentId);
    if (!investment) {
      return res.status(404).json({
        message: "Investment not found",
      });
    }

    const profitFlag =
      typeof isProfit === "boolean"
        ? isProfit
        : Number(returnAmt) >= Number(investment.amount);

    const selectedBank = await getSelectedBankIdService(req.user._id);
    if (!selectedBank) {
      throw new Error("Selected bank not found");
    }

    const bankData = await updateBankBalanceService(
      String(selectedBank._id),
      Number(returnAmt),
    );

    const updatedInvestment = await receiveInvestmentReturnService(
      InvestmentId,
      Number(returnAmt),
      profitFlag,
    );

    res.status(200).json({
      message: "Investment return recorded successfully",
      data: updatedInvestment,
      bank: bankData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllInvestmentController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const investment = await getAllInvestmentService(userId);
    res.status(200).json({
      message: "Investment  retrieved successfully",
      data: investment,
      userId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getInvestmentByIdController = async (req, res, next) => {
  try {
    const InvestmentId = req.params.id;
    const investment = await getInvestmentByIdService(InvestmentId);
    if (!investment) {
      return res.status(404).json({
        message: "Investment not found",
      });
    }
    res.status(200).json({
      message: "Investment retrieved successfully",
      data: investment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateInvestmentController = async (req, res, next) => {
  try {
    const InvestmentId = req.params.id;
    const InvestmentData = req.body;
    const existingInvestment = await getInvestmentByIdService(InvestmentId);
    if (!existingInvestment) {
      return res.status(404).json({
        message: "Investment not found",
      });
    }
    if (
      InvestmentData.name &&
      InvestmentData.name !== existingInvestment.name
    ) {
      const InvestmentWithSameName = await getInvestmentByNameService(
        InvestmentData.name,
      );
      if (InvestmentWithSameName) {
        return res.status(400).json({
          message: "Investment with this name already exists",
        });
      }
    }
    const updatedInvestment = await updateInvestmentBalanceService(
      InvestmentId,
      InvestmentData.amount,
    );
    const selectedBank = await getSelectedBankIdService(req.user._id);
    if (!selectedBank) {
      throw new Error("Selected bank not found");
    }
    const bankData = await updateBankBalanceService(
      String(selectedBank._id),
      -Number(InvestmentData.amount),
    );

    res.status(200).json({
      message: "Investment updated successfully",
      data: updatedInvestment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteInvestmentController = async (req, res, next) => {
  try {
    const InvestmentId = req.params.id;
    const existingInvestment = await getInvestmentByIdService(InvestmentId);
    if (!existingInvestment) {
      return res.status(404).json({
        message: "Investment not found",
      });
    }
    const deletedInvestment = await deleteInvestmentService(InvestmentId);
    res.status(200).json({
      message: "Investment deleted successfully",
      data: deletedInvestment,
    });
  } catch (error) {
    next(error);
  }
};
