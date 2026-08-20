const {
  updateBankBalanceService,
  getSelectedBankIdService,
} = require("../bank/bank.service");
const {
  createFriendsAndFamilyService,
  getAllFriendsAndFamilyService,
  getFriendsAndFamilyByIdService,
  getFriendsAndFamilyByNameService,
  updateFriendsAndFamilyService,
  deleteFriendsAndFamilyService,
  addTransactionService,
  receiveAmountService,
  updateStatusService,
} = require("./friendsandfamily.service");

module.exports.createFriendsAndFamilyController = async (req, res, next) => {
  try {
    const friendsAndFamilyData = req.body;
    const userId = req.user._id;

    friendsAndFamilyData.userId = userId;
    const existingFriendsAndFamily = await getFriendsAndFamilyByNameService(
      friendsAndFamilyData.name,
    );
    if (existingFriendsAndFamily) {
      return res.status(400).json({
        message: "Friends and Family with this name already exists",
      });
    }
    const selectedBank = await getSelectedBankIdService(userId);
    if (!selectedBank) {
      return res.status(404).json({ message: "Selected bank not found" });
    }
    const amount = -Number(friendsAndFamilyData.transactions[0].amount);
    const bankData = await updateBankBalanceService(
      String(selectedBank._id),
      amount,
    );
    const newFriendsAndFamily =
      await createFriendsAndFamilyService(friendsAndFamilyData);
    res.status(201).json({
      message: "Friends and Family created successfully",
      data: newFriendsAndFamily,
      bank: bankData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllFriendsAndFamilyController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const friendsAndFamilyList = await getAllFriendsAndFamilyService(userId);
    res.status(200).json({
      message: "Friends and Family retrieved successfully",
      data: friendsAndFamilyList,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getFriendsAndFamilyByIdController = async (req, res, next) => {
  try {
    const FriendsAndFamilyId = req.params.id;
    const FriendsAndFamily =
      await getFriendsAndFamilyByIdService(FriendsAndFamilyId);
    if (!FriendsAndFamily) {
      return res.status(404).json({
        message: "FriendsAndFamily not found",
      });
    }
    res.status(200).json({
      message: "FriendsAndFamily retrieved successfully",
      data: FriendsAndFamily,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateFriendsAndFamilyController = async (req, res, next) => {
  try {
    const FriendsAndFamilyId = req.params.id;
    const FriendsAndFamilyData = req.body;
    const existingFriendsAndFamily =
      await getFriendsAndFamilyByIdService(FriendsAndFamilyId);
    if (!existingFriendsAndFamily) {
      return res.status(404).json({
        message: "FriendsAndFamily not found",
      });
    }
    if (
      FriendsAndFamilyData.name &&
      FriendsAndFamilyData.name !== existingFriendsAndFamily.name
    ) {
      const FriendsAndFamilyWithSameName =
        await getFriendsAndFamilyByNameService(FriendsAndFamilyData.name);
      if (FriendsAndFamilyWithSameName) {
        return res.status(400).json({
          message: "FriendsAndFamily with this name already exists",
        });
      }
    }
    // If transactions are present in the update, adjust the selected bank balance
    if (
      FriendsAndFamilyData.transactions &&
      FriendsAndFamilyData.transactions.length > 0
    ) {
      const newAmount = Number(
        FriendsAndFamilyData.transactions[0].amount || 0,
      );
      const existingFirst = existingFriendsAndFamily.transactions?.[0];
      const existingAmount = existingFirst
        ? Number(existingFirst.amount || 0)
        : 0;
      const delta = newAmount - existingAmount; // positive => more given, negative => reduced

      if (delta !== 0) {
        const selectedBank = await getSelectedBankIdService(req.user._id);
        if (!selectedBank) {
          return res.status(404).json({ message: "Selected bank not found" });
        }

        // When user gives more money (delta > 0) we need to deduct from bank (amount negative)
        // When the amount is reduced (delta < 0) we add back to bank (amount positive)
        const bankAdjustment = -delta;
        await updateBankBalanceService(
          String(selectedBank._id),
          bankAdjustment,
        );
      }
    }

    const updatedFriendsAndFamily = await updateFriendsAndFamilyService(
      FriendsAndFamilyId,
      FriendsAndFamilyData,
    );
    res.status(200).json({
      message: "FriendsAndFamily updated successfully",
      data: updatedFriendsAndFamily,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteFriendsAndFamilyController = async (req, res, next) => {
  try {
    const FriendsAndFamilyId = req.params.id;
    const existingFriendsAndFamily =
      await getFriendsAndFamilyByIdService(FriendsAndFamilyId);
    if (!existingFriendsAndFamily) {
      return res.status(404).json({
        message: "FriendsAndFamily not found",
      });
    }
    const deletedFriendsAndFamily =
      await deleteFriendsAndFamilyService(FriendsAndFamilyId);
    res.status(200).json({
      message: "FriendsAndFamily deleted successfully",
      data: deletedFriendsAndFamily,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.addTransactionController = async (req, res, next) => {
  try {
    const FriendsAndFamilyId = req.params.id;
    const TransactionData = req.body;
    const existingFriendsAndFamily =
      await getFriendsAndFamilyByIdService(FriendsAndFamilyId);
    if (!existingFriendsAndFamily) {
      return res.status(404).json({
        message: "FriendsAndFamily not found",
      });
    }
    const selectedBank = await getSelectedBankIdService(req.user._id);
    if (!selectedBank) {
      return res.status(404).json({
        message: "Selected bank not found",
      });
    }
    const amount = -Number(TransactionData.amount);
    await updateBankBalanceService(String(selectedBank._id), amount);
    const updatedTransactionData = await addTransactionService(
      FriendsAndFamilyId,
      TransactionData,
    );
    res.status(200).json({
      message: "TransactionData updated successfully",
      data: updatedTransactionData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.receiveAmountController = async (req, res, next) => {
  try {
    const FriendsAndFamilyId = req.params.id;
    const TransactionId = req.params.tid;
    const existingFriendsAndFamily =
      await getFriendsAndFamilyByIdService(FriendsAndFamilyId);
    if (!existingFriendsAndFamily) {
      return res.status(404).json({
        message: "FriendsAndFamily not found",
      });
    }
    const result = await receiveAmountService(
      FriendsAndFamilyId,
      TransactionId,
      req.user._id,
    );
    res.status(200).json({
      message: "Amount received and transaction removed successfully",
      data: result.updatedFriendsAndFamily,
      bank: result.bankData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateStatusController = async (req, res, next) => {
  try {
    const FriendsAndFamilyId = req.params.fid;
    const TransactionId = req.params.tid;
    const status = req.body.status;
    const existingFriendsAndFamily =
      await getFriendsAndFamilyByIdService(FriendsAndFamilyId);
    if (!existingFriendsAndFamily) {
      return res.status(404).json({
        message: "FriendsAndFamily not found",
      });
    }
    const updatedTransactionStatus = await updateStatusService(
      FriendsAndFamilyId,
      TransactionId,
      status,
    );
    res.status(200).json({
      message: "Transaction status updated successfully",
      data: updatedTransactionStatus,
    });
  } catch (error) {
    next(error);
  }
};
