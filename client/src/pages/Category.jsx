import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../features/category/categorySlice";

function Category() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  const [form, setForm] = useState({ name: "", imageFile: null });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "imageFile" ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setForm({ name: "", imageFile: null });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("Category name is required.");
      return;
    }

    try {
      if (editingId) {
        await dispatch(
          updateCategory({
            id: editingId,
            categoryData: { name: form.name.trim(), imageFile: form.imageFile },
          }),
        ).unwrap();
        setMessage("Category updated successfully.");
      } else {
        await dispatch(
          addCategory({ name: form.name.trim(), imageFile: form.imageFile }),
        ).unwrap();
        setMessage("Category created successfully.");
      }

      resetForm();
      dispatch(fetchCategories());
    } catch (submitError) {
      setMessage(submitError || "Something went wrong.");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({ name: category.name, imageFile: null });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await dispatch(deleteCategory(id)).unwrap();
      setMessage("Category deleted successfully.");
      dispatch(fetchCategories());
    } catch (deleteError) {
      setMessage(deleteError || "Unable to delete category.");
    }
  };

  return (
    <div style={{ padding: "2rem", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "1.5rem",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ margin: "0 0 1rem" }}>Category Manager</h2>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter category name"
                style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1px solid #dbe2ea" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Category Image
              </label>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                style={{ width: "100%", padding: "0.7rem", border: "1px solid #dbe2ea", borderRadius: "10px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.8rem 1.2rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {editingId ? "Update Category" : "Add Category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: "#e2e8f0",
                    color: "#0f172a",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.8rem 1.2rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {(message || error) && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                background: error ? "#fee2e2" : "#dcfce7",
                color: error ? "#991b1b" : "#166534",
                fontWeight: 600,
              }}
            >
              {message || error}
            </div>
          )}
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "1.5rem",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0 }}>Category List</h3>
            {loading && <span>Loading...</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {categories.length === 0 ? (
              <div style={{ padding: "1rem", color: "#64748b" }}>No category added yet.</div>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "1rem",
                    background: "#f8fafc",
                  }}
                >
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "12px", marginBottom: "0.75rem" }}
                    />
                  )}

                  <h4 style={{ margin: "0 0 0.5rem" }}>{category.name}</h4>

                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      style={{
                        background: "#e0e7ff",
                        color: "#312e81",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category._id)}
                      style={{
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;
