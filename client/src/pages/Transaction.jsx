import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  addTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from "../features/Transaction/transactionSlice";

import { fetchBanks } from "../features/bank/bankSlice";

import "./Transaction.css";

function Transaction() {
  const dispatch = useDispatch();

  // =========================
  // TRANSACTION STATE
  // =========================
  const {
    transactions = [],
    loading,
    error,
  } = useSelector((state) => state.transaction);

  // =========================
  // BANK STATE
  // =========================
  const { banks = [] } = useSelector((state) => state.bank);

  // =========================
  // FORM STATE
  // =========================
  const [formState, setFormState] = useState({
    amount: "",
    type: "expense",
    description: "",
  });

  // =========================
  // EDIT STATE
  // =========================
  const [editingId, setEditingId] = useState(null);

  // =========================
  // MESSAGE
  // =========================
  const [message, setMessage] = useState("");

  // =========================
  // CATEGORY STATE
  // =========================
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  // =========================
  // FETCH TRANSACTIONS,
  // BANKS & CATEGORIES
  // =========================
  useEffect(() => {
    // Fetch transactions
    dispatch(fetchTransactions());

    // Fetch banks
    dispatch(fetchBanks());

    // Get token
    const getToken = () => localStorage.getItem("token");

    // Fetch categories
    axios
      .get("http://localhost:3000/api/category", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res) => {
        console.log("CATEGORY API RESPONSE:", res.data);

        /*
          Backend can return different structures.

          Example 1:
          [
            {
              _id: "...",
              name: "Food"
            }
          ]

          Example 2:
          {
            data: [
              {
                _id: "...",
                name: "Food"
              }
            ]
          }

          Example 3:
          {
            categories: [
              {
                _id: "...",
                name: "Food"
              }
            ]
          }
        */

        let categoryList = [];

        if (Array.isArray(res.data)) {
          categoryList = res.data;
        } else if (Array.isArray(res.data?.data)) {
          categoryList = res.data.data;
        } else if (Array.isArray(res.data?.categories)) {
          categoryList = res.data.categories;
        }

        console.log("CATEGORY LIST:", categoryList);

        setCategories(categoryList);

        // Automatically select first category if available
        if (categoryList.length > 0) {
          setSelectedCategory(categoryList[0]);
        } else {
          setSelectedCategory(null);
        }
      })
      .catch((err) => {
        console.error(
          "CATEGORY API ERROR:",
          err.response?.data || err.message
        );

        setCategories([]);
        setSelectedCategory(null);
      });
  }, [dispatch]);

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setEditingId(null);

    setFormState({
      amount: "",
      type: "expense",
      description: "",
    });

    // Select first category again
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    } else {
      setSelectedCategory(null);
    }

    setMessage("");
  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE CATEGORY CHANGE
  // =========================
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;

    const category = categories.find(
      (item) => item._id === categoryId
    );

    setSelectedCategory(category || null);
  };

  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    // Find selected bank
    const selectedBank =
      banks?.find((bank) => bank.isSelected) || null;

    // =========================
    // VALIDATE BANK
    // =========================
    if (!selectedBank) {
      setMessage(
        "No selected bank. Please go to Bank and select a bank first."
      );
      return;
    }

    // =========================
    // VALIDATE CATEGORY
    // =========================
    if (!selectedCategory) {
      setMessage(
        "No category selected. Please create a category first."
      );
      return;
    }

    // =========================
    // VALIDATE AMOUNT
    // =========================
    const amountValue = parseFloat(formState.amount);

    if (
      formState.amount === "" ||
      Number.isNaN(amountValue) ||
      amountValue <= 0
    ) {
      setMessage("Amount must be greater than 0.");
      return;
    }

    // =========================
    // TRANSACTION DATA
    // =========================
    const transactionData = {
      categoryId: selectedCategory._id,
      bankId: selectedBank._id,
      amount: amountValue,
      type: formState.type,
      description: formState.description.trim(),
    };

    console.log(
      "TRANSACTION DATA BEING SENT:",
      transactionData
    );

    try {
      // =========================
      // UPDATE
      // =========================
      if (editingId) {
        await dispatch(
          updateTransaction({
            id: editingId,
            transactionData,
          })
        ).unwrap();

        setMessage(
          "Transaction updated successfully."
        );
      }

      // =========================
      // CREATE
      // =========================
      else {
        await dispatch(
          addTransaction(transactionData)
        ).unwrap();

        setMessage(
          "Transaction created successfully."
        );
      }

      // Refresh transactions
      await dispatch(fetchTransactions()).unwrap();

      // Reset form
      resetForm();
    } catch (submitError) {
      console.error(
        "TRANSACTION ERROR:",
        submitError
      );

      setMessage(
        typeof submitError === "string"
          ? submitError
          : submitError?.message ||
              "Failed to save transaction."
      );
    }
  };

  // =========================
  // EDIT TRANSACTION
  // =========================
  const handleEdit = (transaction) => {
    setEditingId(transaction._id);

    setFormState({
      amount:
        transaction.amount !== undefined &&
        transaction.amount !== null
          ? String(transaction.amount)
          : "",

      type: transaction.type || "expense",

      description:
        transaction.description || "",
    });

    // Find transaction category
    const transactionCategoryId =
      transaction.categoryId?._id ||
      transaction.categoryId;

    const category = categories.find(
      (item) => item._id === transactionCategoryId
    );

    if (category) {
      setSelectedCategory(category);
    }

    setMessage("");
  };

  // =========================
  // DELETE TRANSACTION
  // =========================
  const handleDelete = async (transactionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deleteTransaction(transactionId)
      ).unwrap();

      await dispatch(fetchTransactions()).unwrap();

      setMessage(
        "Transaction deleted successfully."
      );

      if (editingId === transactionId) {
        resetForm();
      }
    } catch (deleteError) {
      console.error(
        "DELETE TRANSACTION ERROR:",
        deleteError
      );

      setMessage(
        typeof deleteError === "string"
          ? deleteError
          : deleteError?.message ||
              "Failed to delete transaction."
      );
    }
  };

  // =========================
  // CALCULATE TOTAL
  // =========================
  const totalTransactions =
    transactions.length;

  const netAmount = transactions.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );

  // =========================
  // UI
  // =========================
  return (
    <div className="transaction-page">

      {/* =========================
          HEADER
      ========================= */}
      <div className="transaction-page__header">

        <div>
          <h2 className="transaction-page__title">
            Transactions
          </h2>

          <p className="transaction-page__subtitle">
            Create, update, and delete your
            transactions.
          </p>
        </div>

        {loading && (
          <span className="transaction-page__loading">
            Loading...
          </span>
        )}

      </div>

      {/* =========================
          FORM + SUMMARY
      ========================= */}
      <div className="transaction-page__grid">

        {/* =========================
            TRANSACTION FORM
        ========================= */}
        <section className="transaction-page__card">

          <h3 className="transaction-page__section-title">
            {editingId
              ? "Edit Transaction"
              : "New Transaction"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="transaction-page__form"
          >

            {/* =========================
                CATEGORY
            ========================= */}
            <div className="transaction-page__form-group">

              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                value={
                  selectedCategory?._id || ""
                }
                onChange={handleCategoryChange}
                className="transaction-page__input"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}

              </select>

              {/* No categories message */}
              {categories.length === 0 && (
                <small className="transaction-page__hint">
                  No categories available.
                  Please create a category first.
                </small>
              )}

            </div>

            {/* =========================
                SELECTED BANK
            ========================= */}
            <div className="transaction-page__form-group">

              <label>
                Selected Bank
              </label>

              <div className="transaction-page__selected">
                {banks?.find(
                  (bank) => bank.isSelected
                )?.name || "No selected bank"}
              </div>

            </div>

            {/* =========================
                AMOUNT
            ========================= */}
            <label className="transaction-page__form-group">

              Amount

              <input
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formState.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="transaction-page__input"
              />

            </label>

            {/* =========================
                TYPE
            ========================= */}
            <label className="transaction-page__form-group">

              Type

              <select
                name="type"
                value={formState.type}
                onChange={handleChange}
                className="transaction-page__input"
              >

                <option value="expense">
                  Expense
                </option>

                <option value="income">
                  Income
                </option>

              </select>

            </label>

            {/* =========================
                DESCRIPTION
            ========================= */}
            <label className="transaction-page__form-group">

              Description

              <input
                name="description"
                value={formState.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="transaction-page__input"
              />

            </label>

            {/* =========================
                BUTTONS
            ========================= */}
            <div className="transaction-page__actions">

              <button
                type="submit"
                disabled={loading}
                className="transaction-page__button transaction-page__button--primary"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update"
                  : "Create"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="transaction-page__button transaction-page__button--secondary"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

          {/* =========================
              MESSAGE
          ========================= */}
          {(message || error) && (
            <div
              className={`transaction-page__message ${
                error
                  ? "transaction-page__message--error"
                  : "transaction-page__message--success"
              }`}
            >
              {error || message}
            </div>
          )}

        </section>

        {/* =========================
            SUMMARY
        ========================= */}
        <section className="transaction-page__card transaction-page__summary-card">

          <h3 className="transaction-page__section-title">
            Summary
          </h3>

          <p className="transaction-page__summary-text">
            Total transactions:{" "}
            <strong>
              {totalTransactions}
            </strong>
          </p>

          <p className="transaction-page__summary-text">
            Net amount:{" "}
            <strong>
              ₹{netAmount.toFixed(2)}
            </strong>
          </p>

        </section>

      </div>

      {/* =========================
          TRANSACTION LIST
      ========================= */}
      <section className="transaction-page__card transaction-page__table-card">

        <div className="transaction-page__table-header">

          <h3 className="transaction-page__section-title">
            Transaction List
          </h3>

        </div>

        <div className="transaction-page__table-wrap">

          <table className="transaction-page__table">

            <thead>

              <tr>

                <th>
                  Description
                </th>

                <th>
                  Category
                </th>

                <th>
                  Bank
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Type
                </th>

                <th>
                  Date
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {transactions.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="transaction-page__empty-row"
                  >
                    No transactions yet.
                    Add one using the form
                    above.
                  </td>

                </tr>

              ) : (

                transactions.map(
                  (transaction) => {

                    const categoryName =
                      transaction.categoryId?.name ||
                      categories.find(
                        (category) =>
                          category._id ===
                          transaction.categoryId
                      )?.name ||
                      transaction.categoryId ||
                      "-";

                    const bankName =
                      transaction.bankId?.name ||
                      banks.find(
                        (bank) =>
                          bank._id ===
                          transaction.bankId
                      )?.name ||
                      transaction.bankId ||
                      "-";

                    return (
                      <tr
                        key={
                          transaction._id
                        }
                      >

                        {/* DESCRIPTION */}
                        <td>
                          {transaction.description ||
                            "-"}
                        </td>

                        {/* CATEGORY */}
                        <td>
                          {categoryName}
                        </td>

                        {/* BANK */}
                        <td>
                          {bankName}
                        </td>

                        {/* AMOUNT */}
                        <td>
                          ₹
                          {Number(
                            transaction.amount || 0
                          ).toFixed(2)}
                        </td>

                        {/* TYPE */}
                        <td>
                          {transaction.type}
                        </td>

                        {/* DATE */}
                        <td>
                          {transaction.createdAt
                            ? new Date(
                                transaction.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        {/* ACTIONS */}
                        <td className="transaction-page__action-cell">

                          <button
                            type="button"
                            className="transaction-page__button transaction-page__button--small"
                            onClick={() =>
                              handleEdit(
                                transaction
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="transaction-page__button transaction-page__button--small transaction-page__button--danger"
                            onClick={() =>
                              handleDelete(
                                transaction._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Transaction;