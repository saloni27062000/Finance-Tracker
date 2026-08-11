import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  clearExpenseError,
} from "../../features/expense/expenseSlice";

import { fetchBanks } from "../../features/bank/bankSlice";
import { fetchCategories } from "../../features/category/categorySlice";

import "./Expense.css";

function Expenses() {
  const dispatch = useDispatch();

  // =====================================================
  // REDUX
  // =====================================================
  const {
    expenses = [],
    loading,
    error,
  } = useSelector(
    (state) => state.expense
  );

  const {
    banks = [],
  } = useSelector(
    (state) => state.bank
  );

  const {
    categories = [],
  } = useSelector(
    (state) => state.category
  );

  // =====================================================
  // FORM
  // =====================================================
  const [form, setForm] = useState({
    amount: "",
    categoryId: "",
    description: "",
  });

  const [editingId, setEditingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [dateFilter, setDateFilter] =
    useState("all");

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchBanks());
    dispatch(fetchCategories());
  }, [dispatch]);

  // =====================================================
  // SELECTED BANK
  // =====================================================
  const selectedBank = useMemo(
    () =>
      banks.find(
        (bank) => bank.isSelected
      ) || null,
    [banks]
  );

  // =====================================================
  // FORM CHANGE
  // =====================================================
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET
  // =====================================================
  const resetForm = () => {
    setForm({
      amount: "",
      categoryId:
        categories[0]?._id || "",
      description: "",
    });

    setEditingId(null);
  };

  // =====================================================
  // SUBMIT
  // =====================================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    dispatch(clearExpenseError());

    // ------------------------------
    // BANK VALIDATION
    // ------------------------------
    if (!selectedBank) {
      setMessage(
        "Please select a bank from the Bank page first."
      );
      return;
    }

    // ------------------------------
    // CATEGORY VALIDATION
    // ------------------------------
    if (!form.categoryId) {
      setMessage(
        "Please select a category."
      );
      return;
    }

    // ------------------------------
    // AMOUNT VALIDATION
    // ------------------------------
    const amount =
      Number(form.amount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setMessage(
        "Amount must be greater than 0."
      );
      return;
    }

    const expenseData = {
      amount,
      categoryId:
        form.categoryId,
      description:
        form.description.trim(),
    };

    try {
      // ============================
      // UPDATE
      // ============================
      if (editingId) {
        await dispatch(
          updateExpense({
            id: editingId,
            expenseData,
          })
        ).unwrap();

        setMessage(
          "Expense updated successfully."
        );
      }

      // ============================
      // CREATE
      // ============================
      else {
        await dispatch(
          addExpense(expenseData)
        ).unwrap();

        setMessage(
          "Expense added successfully."
        );
      }

      // Refresh
      await dispatch(
        fetchExpenses()
      ).unwrap();

      await dispatch(
        fetchBanks()
      ).unwrap();

      resetForm();
    } catch (err) {
      console.error(
        "EXPENSE SAVE ERROR:",
        err
      );

      setMessage(
        typeof err === "string"
          ? err
          : err?.message ||
              "Failed to save expense."
      );
    }
  };

  // =====================================================
  // EDIT
  // =====================================================
  const handleEdit = (expense) => {
    const categoryId =
      expense.categoryId?._id ||
      expense.categoryId ||
      "";

    setEditingId(
      expense._id
    );

    setForm({
      amount: String(
        Math.abs(
          Number(expense.amount || 0)
        )
      ),
      categoryId,
      description:
        expense.description || "",
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE
  // =====================================================
  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this expense?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deleteExpense(id)
      ).unwrap();

      setMessage(
        "Expense deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await dispatch(
        fetchExpenses()
      ).unwrap();

      await dispatch(
        fetchBanks()
      ).unwrap();
    } catch (err) {
      setMessage(
        typeof err === "string"
          ? err
          : err?.message ||
              "Failed to delete expense."
      );
    }
  };

  // =====================================================
  // CATEGORY NAME
  // =====================================================
  const getCategoryName = (
    expense
  ) => {
    if (
      expense.categoryId &&
      typeof expense.categoryId ===
        "object"
    ) {
      return (
        expense.categoryId.name ||
        "Unknown"
      );
    }

    const category =
      categories.find(
        (item) =>
          item._id ===
          expense.categoryId
      );

    return (
      category?.name ||
      "Unknown"
    );
  };

  // =====================================================
  // CATEGORY ID
  // =====================================================
  const getCategoryId = (
    expense
  ) => {
    if (
      expense.categoryId &&
      typeof expense.categoryId ===
        "object"
    ) {
      return expense.categoryId._id;
    }

    return expense.categoryId;
  };

  // =====================================================
  // FILTER
  // =====================================================
  const filteredExpenses =
    useMemo(() => {
      const now =
        new Date();

      return expenses.filter(
        (expense) => {
          const searchText =
            search
              .trim()
              .toLowerCase();

          const description =
            (
              expense.description ||
              ""
            ).toLowerCase();

          const categoryName =
            getCategoryName(
              expense
            ).toLowerCase();

          const matchesSearch =
            !searchText ||
            description.includes(
              searchText
            ) ||
            categoryName.includes(
              searchText
            );

          const matchesCategory =
            categoryFilter ===
              "all" ||
            getCategoryId(
              expense
            ) === categoryFilter;

          const expenseDate =
            new Date(
              expense.createdAt
            );

          let matchesDate =
            true;

          if (
            dateFilter ===
            "today"
          ) {
            matchesDate =
              expenseDate.toDateString() ===
              now.toDateString();
          }

          if (
            dateFilter ===
            "month"
          ) {
            matchesDate =
              expenseDate.getMonth() ===
                now.getMonth() &&
              expenseDate.getFullYear() ===
                now.getFullYear();
          }

          if (
            dateFilter ===
            "last30"
          ) {
            const last30 =
              new Date();

            last30.setDate(
              last30.getDate() -
                30
            );

            matchesDate =
              expenseDate >=
              last30;
          }

          return (
            matchesSearch &&
            matchesCategory &&
            matchesDate
          );
        }
      );
    }, [
      expenses,
      search,
      categoryFilter,
      dateFilter,
      categories,
    ]);

  // =====================================================
  // TOTALS
  // =====================================================
  const totalExpense =
    expenses.reduce(
      (total, expense) =>
        total +
        Math.abs(
          Number(
            expense.amount || 0
          )
        ),
      0
    );

  const monthExpense =
    expenses.reduce(
      (total, expense) => {
        const date =
          new Date(
            expense.createdAt
          );

        const now =
          new Date();

        if (
          date.getMonth() ===
            now.getMonth() &&
          date.getFullYear() ===
            now.getFullYear()
        ) {
          return (
            total +
            Math.abs(
              Number(
                expense.amount ||
                  0
              )
            )
          );
        }

        return total;
      },
      0
    );

  const highestExpense =
    expenses.reduce(
      (highest, expense) =>
        Math.max(
          highest,
          Math.abs(
            Number(
              expense.amount ||
                0
            )
          )
        ),
      0
    );

  // =====================================================
  // CURRENCY
  // =====================================================
  const formatCurrency = (
    value
  ) =>
    new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(value);

  // =====================================================
  // DATE
  // =====================================================
  const formatDate = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    return new Date(
      value
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="expense-page">

      {/* ================= HEADER ================= */}
      <div className="expense-header">
        <div>
          <span className="expense-eyebrow">
            FINANCE TRACKER
          </span>

          <h1>
            Expense Management
          </h1>

          <p>
            Track, manage and
            understand your
            spending.
          </p>
        </div>

        {loading && (
          <div className="expense-loading">
            Loading...
          </div>
        )}
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="expense-summary">

        <div className="expense-summary-card primary">
          <span>
            Total Expenses
          </span>

          <strong>
            {formatCurrency(
              totalExpense
            )}
          </strong>

          <small>
            {expenses.length} transactions
          </small>
        </div>

        <div className="expense-summary-card">
          <span>
            This Month
          </span>

          <strong>
            {formatCurrency(
              monthExpense
            )}
          </strong>

          <small>
            Current month
          </small>
        </div>

        <div className="expense-summary-card">
          <span>
            Highest Expense
          </span>

          <strong>
            {formatCurrency(
              highestExpense
            )}
          </strong>

          <small>
            Largest transaction
          </small>
        </div>

        <div className="expense-summary-card">
          <span>
            Selected Bank
          </span>

          <strong>
            {selectedBank?.name ||
              "No bank"}
          </strong>

          <small>
            {selectedBank
              ? `Balance: ${formatCurrency(
                  Number(
                    selectedBank.balance ||
                      0
                  )
                )}`
              : "Select a bank first"}
          </small>
        </div>

      </div>

      {/* ================= MAIN ================= */}
      <div className="expense-main">

        {/* ================= FORM ================= */}
        <div className="expense-card">

          <div className="expense-card-header">
            <div>
              <span>
                {editingId
                  ? "EDIT EXPENSE"
                  : "NEW EXPENSE"}
              </span>

              <h2>
                {editingId
                  ? "Update Expense"
                  : "Add Expense"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                className="expense-cancel"
                onClick={
                  resetForm
                }
              >
                Cancel
              </button>
            )}
          </div>

          <form
            className="expense-form"
            onSubmit={
              handleSubmit
            }
          >

            <div className="expense-field">
              <label>
                Amount
              </label>

              <div className="amount-input">
                <span>₹</span>

                <input
                  type="number"
                  name="amount"
                  value={
                    form.amount
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="expense-field">
              <label>
                Category
              </label>

              <select
                name="categoryId"
                value={
                  form.categoryId
                }
                onChange={
                  handleChange
                }
                required
              >
                <option value="">
                  Select category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={
                        category._id
                      }
                      value={
                        category._id
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  )
                )}
              </select>

              {categories.length ===
                0 && (
                <small>
                  Please create a
                  category first.
                </small>
              )}
            </div>

            <div className="expense-field">
              <label>
                Selected Bank
              </label>

              <div className="selected-bank">
                <div className="bank-icon">
                  🏦
                </div>

                <div>
                  <strong>
                    {selectedBank?.name ||
                      "No bank selected"}
                  </strong>

                  <small>
                    {selectedBank
                      ? `Balance: ${formatCurrency(
                          Number(
                            selectedBank.balance ||
                              0
                          )
                        )}`
                      : "Select a bank from Bank page"}
                  </small>
                </div>
              </div>
            </div>

            <div className="expense-field">
              <label>
                Description
                <span>
                  Optional
                </span>
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                placeholder="Enter expense description..."
                rows="4"
                maxLength="200"
              />
            </div>

            <button
              type="submit"
              className="expense-submit"
              disabled={
                loading ||
                !selectedBank ||
                categories.length ===
                  0
              }
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Expense"
                : "Add Expense"}
            </button>

          </form>

          {(message ||
            error) && (
            <div
              className={`expense-message ${
                error
                  ? "error"
                  : "success"
              }`}
            >
              {message ||
                error}
            </div>
          )}

        </div>

        {/* ================= INSIGHTS ================= */}
        <div className="expense-card">

          <div className="expense-card-header">
            <div>
              <span>
                OVERVIEW
              </span>

              <h2>
                Spending Snapshot
              </h2>
            </div>
          </div>

          <div className="average-box">
            <span>
              Average Expense
            </span>

            <strong>
              {formatCurrency(
                expenses.length
                  ? totalExpense /
                      expenses.length
                  : 0
              )}
            </strong>
          </div>

          <h3 className="category-title">
            Category Spending
          </h3>

          <div className="category-list">

            {categories
              .map((category) => {
                const amount =
                  expenses
                    .filter(
                      (expense) =>
                        getCategoryId(
                          expense
                        ) ===
                        category._id
                    )
                    .reduce(
                      (
                        sum,
                        expense
                      ) =>
                        sum +
                        Math.abs(
                          Number(
                            expense.amount ||
                              0
                          )
                        ),
                      0
                    );

                return {
                  ...category,
                  amount,
                };
              })
              .filter(
                (category) =>
                  category.amount >
                  0
              )
              .sort(
                (a, b) =>
                  b.amount -
                  a.amount
              )
              .slice(0, 5)
              .map(
                (category) => {
                  const percentage =
                    totalExpense
                      ? (category.amount /
                          totalExpense) *
                        100
                      : 0;

                  return (
                    <div
                      className="category-row"
                      key={
                        category._id
                      }
                    >
                      <div>
                        <span>
                          {
                            category.name
                          }
                        </span>

                        <strong>
                          {formatCurrency(
                            category.amount
                          )}
                        </strong>
                      </div>

                      <div className="progress">
                        <span
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}

          </div>

        </div>

      </div>

      {/* ================= HISTORY ================= */}
      <div className="expense-card history-card">

        <div className="history-header">
          <div>
            <span>
              HISTORY
            </span>

            <h2>
              Expense History
            </h2>
          </div>

          <strong>
            {
              filteredExpenses.length
            } results
          </strong>
        </div>

        {/* FILTERS */}
        <div className="filters">

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search expense..."
          />

          <select
            value={
              categoryFilter
            }
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={
                    category._id
                  }
                  value={
                    category._id
                  }
                >
                  {
                    category.name
                  }
                </option>
              )
            )}
          </select>

          <select
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Time
            </option>

            <option value="today">
              Today
            </option>

            <option value="month">
              This Month
            </option>

            <option value="last30">
              Last 30 Days
            </option>
          </select>

        </div>

        {/* TABLE */}
        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>
                  Description
                </th>

                <th>
                  Category
                </th>

                <th>
                  Date
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredExpenses.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="empty"
                  >
                    <div>
                      💸
                    </div>

                    <h3>
                      No expenses found
                    </h3>

                    <p>
                      Add an expense
                      to see it here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(
                  (expense) => (
                    <tr
                      key={
                        expense._id
                      }
                    >
                      <td>
                        <strong>
                          {expense.description ||
                            "No description"}
                        </strong>
                      </td>

                      <td>
                        <span className="badge">
                          {getCategoryName(
                            expense
                          )}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          expense.createdAt
                        )}
                      </td>

                      <td className="expense-amount">
                        -
                        {formatCurrency(
                          Math.abs(
                            Number(
                              expense.amount ||
                                0
                            )
                          )
                        )}
                      </td>

                      <td>
                        <div className="actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                expense
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                expense._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Expenses;