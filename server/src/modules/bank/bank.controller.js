const {
  createBankService,
  getAllBanksService,
  getBankByIdService,
  getBankByNameService,
  updateBankService,
  deleteBankService,
  makeSelectedBankService,
  updateBankBalanceService,
} = require("./bank.service");

module.exports.createBankController = async (req, res, next) => {
  try {
    const bankData = req.body;
    const userId = req.user._id;

    bankData.userId = userId;
    const existingBank = await getBankByNameService(bankData.name);
    if (existingBank) {
      return res.status(400).json({
        message: "Bank with this name already exists",
      });
    }
    const isSelected = bankData.isSelected || false;
    if (isSelected) {
      await makeSelectedBankService(bankData.userId, null);
    }
    const newBank = await createBankService(bankData);
    res.status(201).json({
      message: "Bank created successfully",
      data: newBank,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllBanksController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const banks = await getAllBanksService(userId);
    res.status(200).json({
      message: "Banks retrieved successfully",
      data: banks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getBankByIdController = async (req, res, next) => {
  try {
    const bankId = req.params.id;
    const bank = await getBankByIdService(bankId);
    if (!bank) {
      return res.status(404).json({
        message: "Bank not found",
      });
    }
    res.status(200).json({
      message: "Bank retrieved successfully",
      data: bank,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateBankController = async (req, res, next) => {
  try {
    const bankId = req.params.id;
    const bankData = req.body;
    const existingBank = await getBankByIdService(bankId);
    if (!existingBank) {
      return res.status(404).json({
        message: "Bank not found",
      });
    }
    if (bankData.name && bankData.name !== existingBank.name) {
      const bankWithSameName = await getBankByNameService(bankData.name);
      if (bankWithSameName) {
        return res.status(400).json({
          message: "Bank with this name already exists",
        });
      }
    }
    const isSelected = bankData.isSelected || false;
    if (isSelected) {
      await makeSelectedBankService(existingBank.userId, bankId);
    }
    const updatedBank = await updateBankService(bankId, bankData);
    res.status(200).json({
      message: "Bank updated successfully",
      data: updatedBank,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteBankController = async (req, res, next) => {
  try {
    const bankId = req.params.id;
    const existingBank = await getBankByIdService(bankId);
    if (!existingBank) {
      return res.status(404).json({
        message: "Bank not found",
      });
    }
    const deletedBank = await deleteBankService(bankId);
    res.status(200).json({
      message: "Bank deleted successfully",
      data: deletedBank,
    });
  } catch (error) {
    next(error);
  }
};
