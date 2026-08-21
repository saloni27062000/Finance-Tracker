const FriendsAndFamilyModel = require("./friendsandfamily.model");
const {
  updateBankBalanceService,
  getSelectedBankIdService,
} = require("../bank/bank.service");

module.exports.createFriendsAndFamilyService = async (friendsAndFamilyData) => {
  try {
    return await FriendsAndFamilyModel.create(friendsAndFamilyData);
  } catch (error) {
    throw error;
  }
};

module.exports.getAllFriendsAndFamilyService = async (userId) => {
  try {
    return await FriendsAndFamilyModel.find({ userId });
  } catch (error) {
    throw error;
  }
};

module.exports.getFriendsAndFamilyByIdService = async (friendsAndFamilyId) => {
  try {
    return await FriendsAndFamilyModel.findById(friendsAndFamilyId);
  } catch (error) {
    throw error;
  }
};

module.exports.getFriendsAndFamilyByNameService = async (
  friendsAndFamilyName,
  userId,
) => {
  try {
    const query = { name: friendsAndFamilyName };
    if (userId) query.userId = userId;
    return await FriendsAndFamilyModel.findOne(query);
  } catch (error) {
    throw error;
  }
};

module.exports.updateFriendsAndFamilyService = async (
  friendsAndFamilyId,
  friendsAndFamilyData,
) => {
  try {
    return await FriendsAndFamilyModel.findByIdAndUpdate(
      friendsAndFamilyId,
      friendsAndFamilyData,
      { new: true },
    );
  } catch (error) {
    throw error;
  }
};

module.exports.deleteFriendsAndFamilyService = async (friendsAndFamilyId) => {
  try {
    return await FriendsAndFamilyModel.findByIdAndDelete(friendsAndFamilyId);
  } catch (error) {
    throw error;
  }
};

module.exports.addTransactionService = async (
  friendsAndFamilyId,
  transactionData,
) => {
  try {
    const friendsAndFamily =
      await FriendsAndFamilyModel.findById(friendsAndFamilyId);
    if (!friendsAndFamily) {
      throw new Error("Friends and Family not found");
    }
    friendsAndFamily.transactions.push(transactionData);
    return await friendsAndFamily.save();
  } catch (error) {
    throw error;
  }
};

module.exports.receiveAmountService = async (
  friendsAndFamilyId,
  transactionId,
  userId,
) => {
  try {
    const friendsAndFamily =
      await FriendsAndFamilyModel.findById(friendsAndFamilyId);
    if (!friendsAndFamily) {
      throw new Error("Friends and Family not found");
    }
    const transaction = friendsAndFamily.transactions.id(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const amount = Number(transaction.amount);
    friendsAndFamily.transactions = friendsAndFamily.transactions.filter(
      (item) => String(item._id) !== String(transactionId),
    );
    const updatedFriendsAndFamily = await friendsAndFamily.save();

    const selectedBank = await getSelectedBankIdService(userId);
    if (!selectedBank) {
      throw new Error("Selected bank not found");
    }

    const bankData = await updateBankBalanceService(
      String(selectedBank._id),
      Math.abs(amount),
    );

    return { updatedFriendsAndFamily, bankData };
  } catch (error) {
    throw error;
  }
};

module.exports.updateStatusService = async (
  friendsAndFamilyId,
  transactionId,
  status,
) => {
  try {
    const friendsAndFamily =
      await FriendsAndFamilyModel.findById(friendsAndFamilyId);
    if (!friendsAndFamily) {
      throw new Error("Friends and Family not found");
    }
    const transaction = friendsAndFamily.transactions.id(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    transaction.status = status;
    return await friendsAndFamily.save();
  } catch (error) {
    throw error;
  }
};
