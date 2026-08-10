const CategoryModel = require("./category.model");

module.exports.createCategoryService = async (CategoryData) => {
  try {
    return await CategoryModel.create(CategoryData);
  } catch (error) {
    throw error;
  }
};

module.exports.getAllCategorysService = async (userId) => {
  try {
    return await CategoryModel.find({ userId });
  } catch (error) {
    throw error;
  }
};

module.exports.getCategoryByIdService = async (CategoryId) => {
  try {
    return await CategoryModel.findById(CategoryId);
  } catch (error) {
    throw error;
  }
};

module.exports.getCategoryByNameService = async (CategoryName, userId) => {
  try {
    const query = { name: CategoryName };
    if (userId) {
      query.userId = userId;
    }
    return await CategoryModel.findOne(query);
  } catch (error) {
    throw error;
  }
};

module.exports.updateCategoryService = async (CategoryId, CategoryData) => {
  try {
    return await CategoryModel.findByIdAndUpdate(CategoryId, CategoryData, { new: true });
  } catch (error) {
    throw error;
  }
};

module.exports.deleteCategoryService = async (CategoryId) => {
  try {
    return await CategoryModel.findByIdAndDelete(CategoryId);
  } catch (error) {
    throw error;
  }
};
