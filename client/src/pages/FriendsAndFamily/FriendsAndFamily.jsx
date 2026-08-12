import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addFriendsAndFamily,
  deleteFriendsAndFamily,
  fetchFriendsAndFamilies,
  updateFriendsAndFamily,
} from "../../features/FriendsAndFamily/FriendsAndFamilySlice";
import "./FriendsAndFamily.css";

function FriendsAndFamily() {
  const dispatch = useDispatch();
  const { friendsAndFamilies = [], loading, error } = useSelector(
    (state) => state.friendsAndFamily
  );

  const [form, setForm] = useState({
    name: "",
    amount: "",
    issuedDate: "",
    returnDate: "",
    status: "pending",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchFriendsAndFamilies());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({ name: "", amount: "", issuedDate: "", returnDate: "", status: "pending" });
    setEditingId(null);
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("Name is required.");
      return;
    }

    const amountValue = Number(form.amount);

    if (!form.amount || Number.isNaN(amountValue) || amountValue <= 0) {
      setMessage("Amount must be greater than 0.");
      return;
    }

    if (!form.issuedDate) {
      setMessage("Issued date is required.");
      return;
    }

    if (!form.returnDate) {
      setMessage("Return date is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      transactions: [
        {
          amount: amountValue,
          issuedDate: form.issuedDate,
          returnDate: form.returnDate,
          status: form.status,
        },
      ],
    };

    try {
      if (editingId) {
        await dispatch(
          updateFriendsAndFamily({
            id: editingId,
            friendsAndFamilyData: payload,
          })
        ).unwrap();
        setMessage("Friend or family member updated successfully.");
      } else {
        await dispatch(addFriendsAndFamily(payload)).unwrap();
        setMessage("Friend or family member added successfully.");
      }

      resetForm();
      dispatch(fetchFriendsAndFamilies());
    } catch (submitError) {
      setMessage(submitError || "Something went wrong.");
    }
  };

  const handleEdit = (friend) => {
    setEditingId(friend._id);
    const firstTransaction = friend.transactions?.[0] || {};

    setForm({
      name: friend.name || "",
      amount: firstTransaction.amount ?? "",
      issuedDate: firstTransaction.issuedDate
        ? new Date(firstTransaction.issuedDate).toISOString().slice(0, 10)
        : "",
      returnDate: firstTransaction.returnDate
        ? new Date(firstTransaction.returnDate).toISOString().slice(0, 10)
        : "",
      status: firstTransaction.status || "pending",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      await dispatch(deleteFriendsAndFamily(id)).unwrap();
      setMessage("Deleted successfully.");
      dispatch(fetchFriendsAndFamilies());
    } catch (deleteError) {
      setMessage(deleteError || "Unable to delete this entry.");
    }
  };

  return (
    <div className="friends-family-page">
      <div className="friends-family-container">
        <div className="friends-family-card">
          <h2 className="friends-family-title">Friends & Family</h2>

          <form onSubmit={handleSubmit} className="friends-family-form">
            <div className="friends-family-field">
              <label className="friends-family-label">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="friends-family-input"
              />
            </div>

            <div className="friends-family-field">
              <label className="friends-family-label">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                className="friends-family-input"
              />
            </div>

            <div className="friends-family-field">
              <label className="friends-family-label">Issued Date</label>
              <input
                type="date"
                name="issuedDate"
                value={form.issuedDate}
                onChange={handleChange}
                className="friends-family-input"
              />
            </div>

            <div className="friends-family-field">
              <label className="friends-family-label">Return Date</label>
              <input
                type="date"
                name="returnDate"
                value={form.returnDate}
                onChange={handleChange}
                className="friends-family-input"
              />
            </div>

            <div className="friends-family-field">
              <label className="friends-family-label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="friends-family-select"
              >
                <option value="pending">pending</option>
                <option value="returned">returned</option>
              </select>
            </div>

            <div className="friends-family-actions">
              <button type="submit" className="friends-family-button friends-family-button--primary">
                {editingId ? "Update Entry" : "Add Entry"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="friends-family-button friends-family-button--secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {(message || error) && (
            <div
              className={`friends-family-message ${
                error ? "friends-family-message--error" : "friends-family-message--success"
              }`}
            >
              {message || error}
            </div>
          )}
        </div>

        <div className="friends-family-card">
          <div className="friends-family-list-header">
            <h3 className="friends-family-list-title">Entries</h3>
            {loading && <span className="friends-family-loading">Loading...</span>}
          </div>

          <div className="friends-family-list">
            {friendsAndFamilies.length === 0 ? (
              <div className="friends-family-empty">No friends and family entries yet.</div>
            ) : (
              friendsAndFamilies.map((item) => {
                const firstTransaction = item.transactions?.[0] || {};

                return (
                  <div key={item._id} className="friends-family-item">
                    <h4>{item.name}</h4>
                    <p className="friends-family-meta">Amount: {firstTransaction.amount ?? 0}</p>
                    <p className="friends-family-meta">
                      Issued Date: {firstTransaction.issuedDate ? new Date(firstTransaction.issuedDate).toLocaleDateString() : "-"}
                    </p>
                    <p className="friends-family-meta">
                      Return Date: {firstTransaction.returnDate ? new Date(firstTransaction.returnDate).toLocaleDateString() : "-"}
                    </p>
                    <p className="friends-family-meta">Status: {firstTransaction.status || "pending"}</p>

                    <div className="friends-family-item-actions">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="friends-family-button friends-family-button--edit"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="friends-family-button friends-family-button--delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendsAndFamily;
