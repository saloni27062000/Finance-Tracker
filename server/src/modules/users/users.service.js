const UserModel = require("./users.model");

module.exports.createUser = async (userData) => {
  try {
    return await UserModel.create(userData);
  } catch (error) {
    throw error;
  }
};

module.exports.getAllUsers = async () => {
  try {
    return await UserModel.find();
  } catch (error) {
    throw error;
  }
};

module.exports.getUserById = async (userId) => {
  try {
    return await UserModel.findById(userId);
  } catch (error) {
    throw error;
  }
};

module.exports.getUserByEmail = async (email) => {
  try {
    return await UserModel.findOne({ email: email });
  } catch (error) {
    throw error;
  }
};

module.exports.updateUser = async (userId, userData) => {
  try {
    return await UserModel.findByIdAndUpdate(userId, userData, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};

module.exports.deleteUser = async (userId) => {
  try {
    return await UserModel.findByIdAndDelete(userId);
  } catch (error) {
    throw error;
  }
};
