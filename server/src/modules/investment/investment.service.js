const InvestmentModel = require("./investment.model");

module.exports.createInvestmentService = async (InvestmentData) => {
  try {
    return await InvestmentModel.create(InvestmentData);
  } catch (error) {
    throw error;
  }
};

module.exports.getAllInvestmentService = async (userId) => {
  try {
    return await InvestmentModel.find({ userId });
  } catch (error) {
    throw error;
  }
};

module.exports.getInvestmentByIdService = async (InvestmentId) => {
  try {
    return await InvestmentModel.findById(InvestmentId);
  } catch (error) {
    throw error;
  }
};

module.exports.getInvestmentByNameService = async (InvestmentName) => {
  try {
    return await InvestmentModel.findOne({ name: InvestmentName });
  } catch (error) {
    throw error;
  }
};

module.exports.updateInvestmentService = async (InvestmentId, InvestmentData) => {
  try {
    return await InvestmentModel.findByIdAndUpdate(InvestmentId, InvestmentData, { new: true });
  } catch (error) {
    throw error;
  }
};

module.exports.deleteInvestmentService = async (InvestmentId) => {
  try {
    return await InvestmentModel.findByIdAndDelete(InvestmentId);
  } catch (error) {
    throw error;
  }
};

module.exports.receiveInvestmentReturnService = async (
  InvestmentId,
  returnAmt,
  isProfit,
) => {
  try {
    const investment = await InvestmentModel.findById(InvestmentId);
    if (!investment) {
      throw new Error("Investment not found");
    }
    investment.amount = 0;
    investment.returnAmt = returnAmt;
    investment.isProfit = isProfit;

    return await investment.save();
  } catch (error) {
    throw error;
  }
};

module.exports.updateInvestmentBalanceService = async (InvestmentId, amount) => {
  try {
    const investment = await InvestmentModel.findById(InvestmentId);
    investment.amount += amount;
    return await investment.save();
  } catch (error) {
    throw error;
  }
};
