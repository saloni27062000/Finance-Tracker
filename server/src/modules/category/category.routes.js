const express = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const {
  createCategoryController,
  getAllCategorysController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} = require("./category.controller");
const { upload, convertToBase64 } = require("../../middleware/multer.middleware");
const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  convertToBase64,
  authenticate,
  createCategoryController,
);
router.get("/", authenticate, getAllCategorysController);
router.get("/:id", authenticate, getCategoryByIdController);
router.put(
  "/:id",
  upload.single("image"),
  convertToBase64,
  authenticate,
  updateCategoryController,
);
router.delete("/:id", authenticate, deleteCategoryController);

module.exports = router;
