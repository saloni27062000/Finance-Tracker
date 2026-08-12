const {
  createUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("./users.service");
const bcrypt = require("bcrypt");

module.exports.createUserController = async (req, res, next) => {
  try {
    const userData = req.body;
    const { email } = userData;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashedPassword;
    const createdUser = await createUser(userData);
    res.status(201).json({
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserByIdController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUserController = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user?._id;
    const userData = { ...req.body };

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (userData.email && userData.email !== existingUser.email) {
      const userWithSameEmail = await getUserByEmail(userData.email);
      if (userWithSameEmail) {
        return res.status(400).json({
          message: "User with this email already exists",
        });
      }
    }

    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    } else {
      delete userData.password;
    }

    const updatedUser = await updateUser(userId, userData);
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "User updated successfully",
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteUserController = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};
