const {
  createCategoryService,
  getAllCategorysService,
  getCategoryByNameService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} = require("./category.service");

module.exports.createCategoryController = async (req, res, next) => {
  try {
    const CategoryData = { ...req.body };
    const userId = req.user._id;
    CategoryData.userId = userId;

    if (CategoryData.imageDataUri) {
      CategoryData.image = CategoryData.imageDataUri;
    }

    if (!CategoryData.name || !CategoryData.name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await getCategoryByNameService(CategoryData.name.trim(), userId);
    if (existingCategory) {
      return res.status(400).json({
        message: "Category with this name already exists",
      });
    }

    const newCategory = await createCategoryService(CategoryData);
    res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllCategorysController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const Categorys = await getAllCategorysService(userId);
    res.status(200).json({
      message: "Categorys retrieved successfully",
      data: Categorys,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getCategoryByIdController = async (req, res, next) => {
  try {
    const CategoryId = req.params.id;
    const Category = await getCategoryByIdService(CategoryId);
    if (!Category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    res.status(200).json({
      message: "Category retrieved successfully",
      data: Category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateCategoryController = async (req, res, next) => {
  try {
    const CategoryId = req.params.id;
    const CategoryData = { ...req.body };
    const existingCategory = await getCategoryByIdService(CategoryId);

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (CategoryData.imageDataUri) {
      CategoryData.image = CategoryData.imageDataUri;
    }

    if (CategoryData.name && CategoryData.name.trim() !== existingCategory.name) {
      const CategoryWithSameName = await getCategoryByNameService(CategoryData.name.trim(), req.user._id);
      if (CategoryWithSameName && String(CategoryWithSameName._id) !== String(CategoryId)) {
        return res.status(400).json({
          message: "Category with this name already exists",
        });
      }
    }
    const updatedCategory = await updateCategoryService(CategoryId, CategoryData);
    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCategoryController = async (req, res, next) => {
  try {
    const CategoryId = req.params.id;
    const existingCategory = await getCategoryByIdService(CategoryId);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    const deletedCategory = await deleteCategoryService(CategoryId);
    res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    next(error);
  }
};
