import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBank,
  deleteBank,
  fetchBanks,
  updateBank,
} from "../features/bank/bankSlice";
import "./Bank.css";

const Bank = () => {
  const dispatch = useDispatch();
  const { banks, loading, error } = useSelector((state) => state.bank);
  const [formState, setFormState] = useState({
    name: "",
    balance: "",
    isSelected: false,
  });
  const [editingBankId, setEditingBankId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  const resetForm = () => {
    setEditingBankId(null);
    setFormState({ name: "", balance: "", isSelected: false });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = formState.name.trim();
    const balanceValue = parseFloat(formState.balance || 0);

    if (!trimmedName) {
      setMessage("Bank name is required.");
      return;
    }

    if (Number.isNaN(balanceValue) || balanceValue < 0) {
      setMessage("Balance must be a non-negative number.");
      return;
    }

    const bankData = {
      name: trimmedName,
      balance: balanceValue,
      isSelected: formState.isSelected,
    };

    try {
      if (editingBankId) {
        await dispatch(updateBank({ id: editingBankId, bankData })).unwrap();
        setMessage("Bank updated successfully.");
      } else {
        await dispatch(addBank(bankData)).unwrap();
        setMessage("Bank created successfully.");
      }

      if (bankData.isSelected) {
        await dispatch(fetchBanks());
      }

      resetForm();
    } catch (submitError) {
      setMessage("");
    }
  };

  const handleSelect = async (bank) => {
    try {
      await dispatch(
        updateBank({ id: bank._id, bankData: { isSelected: true } }),
      ).unwrap();
      await dispatch(fetchBanks());
      setMessage(`Bank "${bank.name}" is now selected.`);
    } catch (selectError) {
      setMessage("");
    }
  };

  const handleEdit = (bank) => {
    setEditingBankId(bank._id);
    setFormState({
      name: bank.name,
      balance: bank.balance?.toString() ?? "",
      isSelected: bank.isSelected,
    });
    setMessage("");
  };

  const handleDelete = async (bankId) => {
    if (!window.confirm("Are you sure you want to delete this bank?")) {
      return;
    }
    try {
      await dispatch(deleteBank(bankId)).unwrap();
      setMessage("Bank deleted successfully.");
      if (editingBankId === bankId) {
        resetForm();
      }
    } catch (deleteError) {
      setMessage("");
    }
  };

  return (
    <div className="bank-page">
      <div className="bank-page__container">
        <section className="bank-page__hero">
          <h2 className="bank-page__title">Bank Management</h2>
          <p className="bank-page__subtitle">
            Create, update, and delete your banks from one dashboard.
          </p>
        </section>

        <section className="bank-page__grid">
          <div className="bank-page__card">
            <h3 className="bank-page__section-title">
              {editingBankId ? "Edit Bank" : "New Bank"}
            </h3>
            <form onSubmit={handleSubmit} className="bank-page__form">
              <label className="bank-page__form-group">
                Bank Name
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  className="bank-page__input"
                />
              </label>

              <label className="bank-page__form-group">
                Balance
                <input
                  name="balance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formState.balance}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="bank-page__input"
                />
              </label>

              <label className="bank-page__checkbox-group">
                <input
                  name="isSelected"
                  type="checkbox"
                  checked={formState.isSelected}
                  onChange={handleChange}
                />
                Set as selected bank
              </label>

              <div className="bank-page__actions">
                <button type="submit" className="bank-page__button bank-page__button--primary">
                  {editingBankId ? "Update Bank" : "Create Bank"}
                </button>
                {editingBankId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bank-page__button bank-page__button--secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {(message || error) && (
              <div
                className={`bank-page__message ${error ? "bank-page__message--error" : "bank-page__message--success"}`}
              >
                {error || message}
              </div>
            )}
          </div>

          <div className="bank-page__card">
            <h3 className="bank-page__section-title">Summary</h3>
            <p className="bank-page__summary-text">
              Total banks: <strong>{banks.length}</strong>
            </p>
            <p className="bank-page__summary-text">
              Selected banks: <strong>{banks.filter((bank) => bank.isSelected).length}</strong>
            </p>
          </div>
        </section>

        <section className="bank-page__card">
          <div className="bank-page__table-header">
            <h3 className="bank-page__section-title">Bank List</h3>
            {loading && <span className="bank-page__loading">Loading...</span>}
          </div>

          <div className="bank-page__table-wrap">
            <table className="bank-page__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Balance</th>
                  <th>Selected</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="bank-page__empty-row">
                      No banks yet. Add one using the form above.
                    </td>
                  </tr>
                ) : (
                  banks.map((bank) => (
                    <tr key={bank._id}>
                      <td>{bank.name}</td>
                      <td>₹{bank.balance?.toFixed(2) ?? "0.00"}</td>
                      <td>{bank.isSelected ? "Yes" : "No"}</td>
                      <td className="bank-page__action-cell">
                        <button
                          onClick={() => handleEdit(bank)}
                          className="bank-page__button bank-page__button--small"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleSelect(bank)}
                          className={`bank-page__button bank-page__button--small ${bank.isSelected ? "bank-page__button--success" : "bank-page__button--primary"}`}
                        >
                          {bank.isSelected ? "Selected" : "Select"}
                        </button>
                        <button
                          onClick={() => handleDelete(bank._id)}
                          className="bank-page__button bank-page__button--small bank-page__button--danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Bank;
