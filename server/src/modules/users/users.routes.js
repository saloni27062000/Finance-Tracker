const express = require("express");
const {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} = require("./users.controller");
const { authenticate } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", createUserController);
router.get("/", getAllUsersController);
router.get("/me", authenticate, getUserByIdController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

module.exports = router;
