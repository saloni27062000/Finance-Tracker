const BankModel = require("./bank.model");

module.exports.createBankService = async (bankData) => {
  try {
    return await BankModel.create(bankData);
  } catch (error) {
    throw error;
  }
};

module.exports.getAllBanksService = async (userId) => {
  try {
    return await BankModel.find({ userId });
  } catch (error) {
    throw error;
  }
};

module.exports.getBankByIdService = async (bankId) => {
  try {
    return await BankModel.findById(bankId);
  } catch (error) {
    throw error;
  }
};

module.exports.getBankByNameService = async (bankName) => {
  try {
    return await BankModel.findOne({ name: bankName });
  } catch (error) {
    throw error;
  }
};
module.exports.getSelectedBankIdService = async () => {
  try {
    return await BankModel.findOne({ isSelected: true });
  } catch (error) {
    throw error;
  }
};

module.exports.updateBankService = async (bankId, bankData) => {
  try {
    return await BankModel.findByIdAndUpdate(bankId, bankData, { new: true });
  } catch (error) {
    throw error;
  }
};

module.exports.deleteBankService = async (bankId) => {
  try {
    return await BankModel.findByIdAndDelete(bankId);
  } catch (error) {
    throw error;
  }
};

module.exports.makeSelectedBankService = async (userId, bankId) => {
  try {
    await BankModel.updateMany({ userId }, { isSelected: false });

    return bankId
      ? await BankModel.findOneAndUpdate(
          { userId, _id: bankId },
          { isSelected: true },
          { new: true },
        )
      : null;
  } catch (error) {
    throw error;
  }
};

module.exports.updateBankBalanceService = async (bankId, amount) => {
  try {
    const bank = await BankModel.findById(bankId);
    if (amount < 0) {
      if (Math.abs(amount) > bank.balance) {
        throw new Error("Insufficient Fund!!!")
      }
    }
    bank.balance += amount;
    return await bank.save();
  } catch (error) {
    throw error;
  }
};
