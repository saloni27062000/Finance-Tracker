const TransactionModel = require("./transaction.model");

module.exports.createTransactionService = async (transactionData) => {
  try {
    return await TransactionModel.create(transactionData);
  } catch (error) {
    throw error;
  }
};

module.exports.getAllTransactionsService = async (userId) => {
  try {
    return await TransactionModel.find({ userId });
  } catch (error) {
    throw error;
  }
};

module.exports.getTransactionByIdService = async (transactionId) => {
  try {
    return await TransactionModel.findById(transactionId);
  } catch (error) {
    throw error;
  }
};

module.exports.updateTransactionService = async (transactionId, transactionData) => {
  try {
    return await TransactionModel.findByIdAndUpdate(transactionId, transactionData, { new: true });
  } catch (error) {
    throw error;
  }
};

module.exports.deleteTransactionService = async (transactionId) => {
  try {
    return await TransactionModel.findByIdAndDelete(transactionId);
  } catch (error) {
    throw error;
  }
};