import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBank,
  deleteBank,
  fetchBanks,
  updateBank,
} from "../../features/bank/bankSlice";
import "./Bank.css";

const Bank = () => {
  const dispatch = useDispatch();

  const { banks = [], loading, error } = useSelector(
    (state) => state.bank
  );

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

    setFormState({
      name: "",
      balance: "",
      isSelected: false,
    });
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

    setMessage("");

    const trimmedName = formState.name.trim();
    const balanceValue = Number(formState.balance);

    if (!trimmedName) {
      setMessage("Bank name is required.");
      return;
    }

    if (
      formState.balance === "" ||
      Number.isNaN(balanceValue) ||
      balanceValue < 0
    ) {
      setMessage("Please enter a valid non-negative balance.");
      return;
    }

    const bankData = {
      name: trimmedName,
      balance: balanceValue,
      isSelected: Boolean(formState.isSelected),
    };

    console.log("Sending bank data:", bankData);

    try {
      if (editingBankId) {
        await dispatch(
          updateBank({
            id: editingBankId,
            bankData,
          })
        ).unwrap();

        setMessage("Bank updated successfully.");
      } else {
        await dispatch(addBank(bankData)).unwrap();

        setMessage("Bank created successfully.");
      }

      // Refresh bank list from backend
      await dispatch(fetchBanks()).unwrap();

      resetForm();
    } catch (submitError) {
      console.error("Bank operation error:", submitError);

      setMessage(
        typeof submitError === "string"
          ? submitError
          : submitError?.message || "Failed to save bank."
      );
    }
  };

  const handleSelect = async (bank) => {
    setMessage("");

    try {
      await dispatch(
        updateBank({
          id: bank._id,
          bankData: {
            isSelected: true,
          },
        })
      ).unwrap();

      await dispatch(fetchBanks()).unwrap();

      setMessage(`Bank "${bank.name}" is now selected.`);
    } catch (selectError) {
      console.error("Select bank error:", selectError);

      setMessage(
        typeof selectError === "string"
          ? selectError
          : selectError?.message || "Failed to select bank."
      );
    }
  };

  const handleEdit = (bank) => {
    setEditingBankId(bank._id);

    setFormState({
      name: bank.name || "",
      balance:
        bank.balance !== undefined && bank.balance !== null
          ? String(bank.balance)
          : "",
      isSelected: Boolean(bank.isSelected),
    });

    setMessage("");
  };

  const handleDelete = async (bankId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bank?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      await dispatch(deleteBank(bankId)).unwrap();

      await dispatch(fetchBanks()).unwrap();

      setMessage("Bank deleted successfully.");

      if (editingBankId === bankId) {
        resetForm();
      }
    } catch (deleteError) {
      console.error("Delete bank error:", deleteError);

      setMessage(
        typeof deleteError === "string"
          ? deleteError
          : deleteError?.message || "Failed to delete bank."
      );
    }
  };

  return (
    <div className="bank-page">
      <div className="bank-page__container">

        {/* HEADER */}
        <section className="bank-page__hero">
          <h2 className="bank-page__title">Bank Management</h2>

          <p className="bank-page__subtitle">
            Create, update, and delete your banks from one dashboard.
          </p>
        </section>

        {/* FORM + SUMMARY */}
        <section className="bank-page__grid">

          {/* FORM */}
          <div className="bank-page__card">
            <h3 className="bank-page__section-title">
              {editingBankId ? "Edit Bank" : "New Bank"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="bank-page__form"
            >

              {/* BANK NAME */}
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

              {/* BALANCE */}
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

              {/* SELECT BANK */}
              <label className="bank-page__checkbox-group">
                <input
                  name="isSelected"
                  type="checkbox"
                  checked={formState.isSelected}
                  onChange={handleChange}
                />

                Set as selected bank
              </label>

              {/* BUTTONS */}
              <div className="bank-page__actions">

                <button
                  type="submit"
                  disabled={loading}
                  className="bank-page__button bank-page__button--primary"
                >
                  {loading
                    ? "Saving..."
                    : editingBankId
                    ? "Update Bank"
                    : "Create Bank"}
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

            {/* MESSAGE */}
            {(message || error) && (
              <div
                className={`bank-page__message ${
                  error
                    ? "bank-page__message--error"
                    : "bank-page__message--success"
                }`}
              >
                {error || message}
              </div>
            )}
          </div>

          {/* SUMMARY */}
          <div className="bank-page__card">

            <h3 className="bank-page__section-title">
              Summary
            </h3>

            <p className="bank-page__summary-text">
              Total banks: <strong>{banks.length}</strong>
            </p>

            <p className="bank-page__summary-text">
              Selected banks:{" "}
              <strong>
                {banks.filter((bank) => bank.isSelected).length}
              </strong>
            </p>

          </div>
        </section>

        {/* BANK LIST */}
        <section className="bank-page__card">

          <div className="bank-page__table-header">

            <h3 className="bank-page__section-title">
              Bank List
            </h3>

            {loading && (
              <span className="bank-page__loading">
                Loading...
              </span>
            )}

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
                    <td
                      colSpan="4"
                      className="bank-page__empty-row"
                    >
                      No banks yet. Add one using the form above.
                    </td>
                  </tr>
                ) : (
                  banks.map((bank) => (
                    <tr key={bank._id}>

                      <td>
                        {bank.name}
                      </td>

                      <td>
                        ₹
                        {Number(bank.balance || 0).toFixed(2)}
                      </td>

                      <td>
                        {bank.isSelected ? "Yes" : "No"}
                      </td>

                      <td className="bank-page__action-cell">

                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() => handleEdit(bank)}
                          className="bank-page__button bank-page__button--small"
                        >
                          Edit
                        </button>

                        {/* SELECT */}
                        <button
                          type="button"
                          onClick={() => handleSelect(bank)}
                          className={`bank-page__button bank-page__button--small ${
                            bank.isSelected
                              ? "bank-page__button--success"
                              : "bank-page__button--primary"
                          }`}
                        >
                          {bank.isSelected
                            ? "Selected"
                            : "Select"}
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
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