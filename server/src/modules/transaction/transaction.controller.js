const { getSelectedBankIdService, updateBankBalanceService } = require("../bank/bank.service");
const {
  createTransactionService,
  getAllTransactionsService,
  getTransactionByIdService,
  updateTransactionService,
  deleteTransactionService,
} = require("./transaction.service");

module.exports.createTransactionController = async (req, res, next) => {
  try {
    const transactionData = req.body;
    transactionData.userId = req.user._id;
    if (transactionData.type == "expense") {
      transactionData.amount = -transactionData.amount;
    }
    const selectedBank = await getSelectedBankIdService();
    const amount = Number(transactionData.amount);
    const bankData = await updateBankBalanceService(
      String(selectedBank._id),
      amount,
    );
    transactionData.bankId = String(selectedBank._id)
    const newTransaction = await createTransactionService(transactionData);
    res.status(201).json({
      message: "Transaction created successfully",
      data: newTransaction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllTransactionsController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactions = await getAllTransactionsService(userId);
    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getTransactionByIdController = async (req, res, next) => {
  try {
    const transactionId = req.params.id;
    const transaction = await getTransactionByIdService(transactionId);
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
    res.status(200).json({
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateTransactionController = async (req, res, next) => {
  try {
    const transactionId = req.params.id;
    const transactionData = req.body;
    const existingTransaction = await getTransactionByIdService(transactionId);
    if (!existingTransaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
    const updatedTransaction = await updateTransactionService(
      transactionId,
      transactionData,
    );
    res.status(200).json({
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteTransactionController = async (req, res, next) => {
  try {
    const transactionId = req.params.id;
    const existingTransaction = await getTransactionByIdService(transactionId);
    if (!existingTransaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
    const deletedTransaction = await deleteTransactionService(transactionId);
    res.status(200).json({
      message: "Transaction deleted successfully",
      data: deletedTransaction,
    });
  } catch (error) {
    next(error);
  }
};
