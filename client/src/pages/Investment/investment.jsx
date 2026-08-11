import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addInvestment,
  deleteInvestment,
  fetchInvestments,
  recordInvestmentReturn,
  updateInvestment,
} from "../../features/investment/investmentSlice";

const emptyForm = {
  name: "",
  amount: "",
  returnAmt: "",
  isProfit: false,
};

function Investment() {
  const dispatch = useDispatch();
  const { investments = [], loading, error } = useSelector((state) => state.investment);

  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    dispatch(fetchInvestments());
  }, [dispatch]);

  const totalInvested = useMemo(
    () => investments.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [investments],
  );

  const totalReturn = useMemo(
    () => investments.reduce((sum, item) => sum + Number(item.returnAmt || 0), 0),
    [investments],
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormState(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");

    const name = formState.name.trim();
    const amount = Number(formState.amount);

    if (!name) {
      setNotice("Investment name is required.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice("Please enter a valid investment amount greater than zero.");
      return;
    }

    const payload = {
      name,
      amount,
    };

    try {
      if (editingId) {
        await dispatch(updateInvestment({ id: editingId, investmentData: payload })).unwrap();
        setNotice("Investment updated successfully.");
      } else {
        await dispatch(addInvestment(payload)).unwrap();
        setNotice("Investment added successfully.");
      }

      resetForm();
      await dispatch(fetchInvestments());
    } catch (submitError) {
      setNotice(typeof submitError === "string" ? submitError : submitError?.message || "Failed to save investment.");
    }
  };

  const handleEdit = (investment) => {
    setEditingId(investment._id);
    setFormState({
      name: investment.name || "",
      amount: investment.amount != null ? String(investment.amount) : "",
      returnAmt: investment.returnAmt != null ? String(investment.returnAmt) : "",
      isProfit: Boolean(investment.isProfit),
    });
    setNotice("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this investment?");
    if (!confirmed) return;

    setNotice("");

    try {
      await dispatch(deleteInvestment(id)).unwrap();
      await dispatch(fetchInvestments());
      setNotice("Investment deleted successfully.");
      if (editingId === id) {
        resetForm();
      }
    } catch (deleteError) {
      setNotice(typeof deleteError === "string" ? deleteError : deleteError?.message || "Failed to delete investment.");
    }
  };

  const handleReturn = async (investment) => {
    const value = Number(window.prompt(`Enter return amount for ${investment.name}:`, investment.returnAmt || "0"));
    if (!Number.isFinite(value) || value <= 0) {
      setNotice("Please enter a valid positive return amount.");
      return;
    }

    try {
      await dispatch(
        recordInvestmentReturn({
          id: investment._id,
          returnData: {
            returnAmt: value,
            isProfit: value >= Number(investment.amount || 0),
          },
        }),
      ).unwrap();
      setNotice("Investment return recorded successfully.");
      await dispatch(fetchInvestments());
    } catch (returnError) {
      setNotice(typeof returnError === "string" ? returnError : returnError?.message || "Failed to record return.");
    }
  };

  return (
    <div className="bank-page">
      <div className="bank-page__container">
        <section className="bank-page__hero">
          <h2 className="bank-page__title">Investment Management</h2>
          <p className="bank-page__subtitle">Track your investments, returns, and profit status.</p>
        </section>

        <section className="bank-page__grid">
          <div className="bank-page__card">
            <h3 className="bank-page__section-title">{editingId ? "Edit Investment" : "New Investment"}</h3>

            <form onSubmit={handleSubmit} className="bank-page__form">
              <label className="bank-page__form-group">
                Investment Name
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="e.g. Mutual Fund"
                  className="bank-page__input"
                />
              </label>

              <label className="bank-page__form-group">
                Amount
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="bank-page__input"
                />
              </label>

              <div className="bank-page__actions">
                <button type="submit" disabled={loading} className="bank-page__button bank-page__button--primary">
                  {loading ? "Saving..." : editingId ? "Update Investment" : "Create Investment"}
                </button>

                {editingId && (
                  <button type="button" onClick={resetForm} className="bank-page__button bank-page__button--secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {(notice || error) && (
              <div className={`bank-page__message ${error ? "bank-page__message--error" : "bank-page__message--success"}`}>
                {error || notice}
              </div>
            )}
          </div>

          <div className="bank-page__card">
            <h3 className="bank-page__section-title">Summary</h3>
            <p className="bank-page__summary-text">Total invested: <strong>₹{Number(totalInvested || 0).toFixed(2)}</strong></p>
            <p className="bank-page__summary-text">Total return: <strong>₹{Number(totalReturn || 0).toFixed(2)}</strong></p>
            <p className="bank-page__summary-text">Investment count: <strong>{investments.length}</strong></p>
          </div>
        </section>

        <section className="bank-page__card">
          <div className="bank-page__table-header">
            <h3 className="bank-page__section-title">Investment List</h3>
            {loading && <span className="bank-page__loading">Loading...</span>}
          </div>

          <div className="bank-page__table-wrap">
            <table className="bank-page__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Return</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="bank-page__empty-row">No investments yet. Add one to get started.</td>
                  </tr>
                ) : (
                  investments.map((investment) => (
                    <tr key={investment._id}>
                      <td>{investment.name}</td>
                      <td>₹{Number(investment.amount || 0).toFixed(2)}</td>
                      <td>₹{Number(investment.returnAmt || 0).toFixed(2)}</td>
                      <td>{investment.isProfit ? "Profit" : "No Profit"}</td>
                      <td className="bank-page__action-cell">
                        <button type="button" onClick={() => handleEdit(investment)} className="btn btn-secondary bank-page__button bank-page__button--small">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleReturn(investment)} className="bank-page__button bank-page__button--small bank-page__button--primary">
                          Return
                        </button>
                        <button type="button" onClick={() => handleDelete(investment._id)} className="bank-page__button bank-page__button--small bank-page__button--danger">
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
}

export default Investment;
