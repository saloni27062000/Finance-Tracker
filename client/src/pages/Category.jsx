import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../features/category/CategorySlice";
import "./category.css";

const Category = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);
  const [formState, setFormState] = useState({ name: "" });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const resetForm = () => {
    setEditingCategoryId(null);
    setFormState({ name: "" });
    setImageFile(null);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const trimmedName = formState.name.trim();
    if (!trimmedName) {
      setMessage("Category name is required.");
      return;
    }

    if (!imageFile) {
      setMessage("Category image is required.");
      return;
    }

    try {
      const categoryData = new FormData();
      categoryData.append("name", trimmedName);
      categoryData.append("image", imageFile);

      if (editingCategoryId) {
        await dispatch(
          updateCategory({ id: editingCategoryId, categoryData }),
        ).unwrap();
        setMessage("Category updated successfully.");
      } else {
        await dispatch(addCategory(categoryData)).unwrap();
        setMessage("Category created successfully.");
      }

      resetForm();
    } catch (submitError) {
      setMessage(submitError?.message || "Failed to save category.");
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setFormState({ name: category.name });
    setImageFile(null);
    setMessage("Please upload a new image to update this category.");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      setMessage("Category deleted successfully.");
      if (editingCategoryId === categoryId) {
        resetForm();
      }
    } catch (deleteError) {
      setMessage(deleteError?.message || "Failed to delete category.");
    }
  };

  return (
    <div className="category-page">
      <div className="category-container">
        <div className="category-header">
          <div>
            <h1>Categories</h1>
            <p>Manage your income and expense categories</p>
          </div>
        </div>

        <div className="category-form-card">
          <h2>{editingCategoryId ? "Edit Category" : "Add New Category"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category Name</label>
              <input
                name="name"
                type="text"
                placeholder="e.g. Food, Shopping, Salary"
                value={formState.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                required
              />
              {imageFile && <small>Selected file: {imageFile.name}</small>}
            </div>

            <div className="form-actions">
              <button type="submit" className="add-btn" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingCategoryId
                    ? "Update Category"
                    : "Add Category"}
              </button>
              {editingCategoryId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {(message || error) && (
            <div className={`category-message ${error ? "error" : "success"}`}>
              {error || message}
            </div>
          )}
        </div>

        <div className="categories-section">
          <h2>Your Categories</h2>

          {categories.length === 0 ? (
            <div className="empty-category">
              <h3>No categories found</h3>
              <p>Add your first category to start tracking finances.</p>
            </div>
          ) : (
            <div className="category-grid">
              {categories.map((category) => (
                <div className="category-card" key={category._id}>
                  <div className="category-image">
                    {category.image ? (
                      <img src={category.image} alt={category.name} />
                    ) : (
                      <span>{category.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <small>
                      Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </small>
                  </div>

                  <div className="category-actions">
                    <button
                      onClick={() => handleEdit(category)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
