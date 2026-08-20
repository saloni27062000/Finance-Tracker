import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanks } from "../../features/bank/bankSlice";
import { fetchTransactions } from "../../features/transaction/transactionSlice";
import "./Dashboard.css";

const modules = [
  {
    title: "Expenses",
    description: "Track spending and monitor daily costs.",
    path: "/expenses",
    accent: "violet",
    icon: "💸",
  },
  {
    title: "Categories",
    description: "Organize spending by purpose and budget type.",
    path: "/category",
    accent: "blue",
    icon: "📂",
  },
  {
    title: "Transactions",
    description: "Review incoming and outgoing money activity.",
    path: "/transaction",
    accent: "green",
    icon: "🔄",
  },
  {
    title: "Friends & Family",
    description: "Manage shared budgets and personal transfers.",
    path: "/friends-and-family",
    accent: "rose",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    title: "Investments",
    description: "Track long-term plans and wealth performance.",
    path: "/investment",
    accent: "amber",
    icon: "📈",
  },
  {
    title: "Bank",
    description: "Update bank balances and preferred account settings.",
    path: "/bank",
    accent: "cyan",
    icon: "🏦",
  },
  {
    title: "Reports",
    description: "View summaries and financial insights at a glance.",
    path: "/report",
    accent: "indigo",
    icon: "📊",
  },
];

function Dashboard() {
  const dispatch = useDispatch();
  const { transactions = [] } = useSelector((state) => state.transaction);
  const { banks = [] } = useSelector((state) => state.bank);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("currentUser") || "null") ||
      JSON.parse(localStorage.getItem("registeredUser") || "null");

    return {
      firstName: storedUser?.fullname?.firstname || "",
      middleName: storedUser?.fullname?.middlename || "",
      lastName: storedUser?.fullname?.lastname || "",
      email: storedUser?.email || "",
      street: storedUser?.address?.street || "",
      city: storedUser?.address?.city || "",
      state: storedUser?.address?.state || "",
      zip: storedUser?.address?.zip || "",
      age: storedUser?.age || "",
      dob: storedUser?.DOB || storedUser?.dob || "",
    };
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBanks());

    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3000/api/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const categoryList = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data?.categories)
              ? response.data.categories
              : [];

        setCategoryDetails(categoryList);
      })
      .catch(() => {
        setCategoryDetails([]);
      });
  }, [dispatch]);

  const storedUser =
    JSON.parse(localStorage.getItem("currentUser") || "null") ||
    JSON.parse(localStorage.getItem("registeredUser") || "null");

  if (!storedUser) {
    return (
      <div className="login-screen">
        <div className="login-page">
          <h2>No user data found</h2>
          <p>
            Please <Link to="/login">sign in</Link> or{" "}
            <Link to="/register">register</Link> first.
          </p>
        </div>
      </div>
    );
  }

  const fullName = [
    storedUser.fullname?.firstname,
    storedUser.fullname?.middlename,
    storedUser.fullname?.lastname,
  ]
    .filter(Boolean)
    .join(" ");

  const rawDob = storedUser.dob || storedUser.DOB || "";
  const dob = rawDob
    ? new Date(rawDob).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";
  const address = storedUser.address || {};
  const addressValue =
    `${address.street || ""} ${address.city || ""} ${address.state || ""} ${address.zip || ""}`.trim();

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        fullname: {
          firstname: formState.firstName.trim(),
          middlename: formState.middleName.trim(),
          lastname: formState.lastName.trim(),
        },
        email: formState.email.trim(),
        address: {
          street: formState.street.trim(),
          city: formState.city.trim(),
          state: formState.state.trim(),
          zip: formState.zip.trim(),
        },
        age: Number(formState.age),
        DOB: formState.dob,
      };

      const response = await axios.put(
        "http://localhost:3000/api/users/me",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedUser = response.data?.data || payload;
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
      setIsEditing(false);
      setMessage("Profile updated successfully.");
      window.location.reload();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to update profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  const currentMonth = new Date();
  const monthTransactions = (transactions || []).filter((transaction) => {
    const date = new Date(
      transaction.createdAt || transaction.date || Date.now(),
    );
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  });

  const monthlyIncome = monthTransactions
    .filter(
      (transaction) =>
        transaction.type === "income" || Number(transaction.amount) >= 0,
    )
    .reduce(
      (total, transaction) => total + Math.abs(Number(transaction.amount || 0)),
      0,
    );

  const monthlyExpenses = monthTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense" || Number(transaction.amount) < 0,
    )
    .reduce(
      (total, transaction) => total + Math.abs(Number(transaction.amount || 0)),
      0,
    );

  const savings = monthlyIncome - monthlyExpenses;
  const selectedBank = banks.find((bank) => bank.isSelected);
  const accountBalance = Number(selectedBank?.balance || 0);
  const monthlyBudget = accountBalance + monthlyExpenses;
  const remainingBudget = accountBalance;

  const stats = [
    { label: "Modules", value: modules.length + 1, hint: "active areas" },
    {
      label: "User",
      value: fullName || storedUser.email,
      hint: "account owner",
    },
    { label: "DOB", value: dob || "Not set", hint: "profile info" },
  ];

  const overviewCards = [
    {
      label: "Income",
      value: `₹${monthlyIncome.toLocaleString("en-IN")}`,
      trend: "+12.5%",
      tone: "up",
    },
    {
      label: "Expenses",
      value: `₹${monthlyExpenses.toLocaleString("en-IN")}`,
      trend: "-4.8%",
      tone: "down",
    },
    {
      label: "Savings",
      value: `₹${savings.toLocaleString("en-IN")}`,
      trend: "+8.1%",
      tone: "up",
    },
    {
      label: "Remaining",
      value: `₹${remainingBudget.toLocaleString("en-IN")}`,
      trend: savings >= 0 ? "Healthy" : "Watch",
      tone: savings >= 0 ? "neutral" : "down",
    },
  ];

  const categoryTotals = {};
  monthTransactions
    .filter(
      (transaction) =>
        (transaction.type === "expense" || Number(transaction.amount) < 0) &&
        Number(transaction.amount) !== 0,
    )
    .forEach((transaction) => {
      const categoryName =
        categoryDetails.find(
          (category) => category._id === transaction.categoryId,
        )?.name ||
        transaction.category?.name ||
        "Other";

      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) +
        Math.abs(Number(transaction.amount || 0));
    });

  const chartColors = ["#6366f1", "#14b8a6", "#f59e0b", "#f97316", "#ec4899"];
  const spendingChart = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value], index) => ({
      label,
      value:
        monthlyExpenses > 0 ? Math.round((value / monthlyExpenses) * 100) : 0,
      color: chartColors[index % chartColors.length],
    }));

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>

        <section className="dashboard-stats">
          {stats.map((stat) => (
            <div className="dashboard-stat" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.hint}</small>
            </div>
          ))}
        </section>

        <section className="oversight-panel">
          <div className="section-heading">
            <h2>Finance overview</h2>
            <span>This month</span>
          </div>

          <div className="overview-grid">
            {overviewCards.map((card) => (
              <div key={card.label} className="overview-card">
                <div className="overview-card__top">
                  <span>{card.label}</span>
                  <span className={`trend trend--${card.tone}`}>
                    {card.trend}
                  </span>
                </div>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="section-heading section-heading--compact">
                <h3>Spending split</h3>
              </div>
              <div className="bar-chart">
                {spendingChart.map((item) => (
                  <div key={item.label} className="bar-item">
                    <div className="bar-label-row">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${item.value}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <div className="section-heading section-heading--compact">
                <h3>Budget progress</h3>
              </div>

              <div className="progress-block">
                <div className="progress-meta">
                  <span>Spent this month</span>
                  <strong>
                    ₹{monthlyExpenses.toLocaleString("en-IN")} / ₹
                    {monthlyBudget.toLocaleString("en-IN")}
                  </strong>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill progress-fill--primary"
                    style={{
                      width: `${monthlyBudget > 0 ? Math.min((monthlyExpenses / monthlyBudget) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="progress-block">
                <div className="progress-meta">
                  <span>Bank balance</span>
                  <strong>₹{remainingBudget.toLocaleString("en-IN")}</strong>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill progress-fill--success"
                    style={{
                      width: `${monthlyBudget > 0 ? Math.min((remainingBudget / monthlyBudget) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <h2>All modules</h2>
            <span>Quick access</span>
          </div>

          <div className="module-grid">
            {modules.map((module) => (
              <Link
                key={module.path}
                to={module.path}
                className={`module-card module-card--${module.accent}`}
              >
                <div className="module-icon">{module.icon}</div>
                <div className="module-content">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>
                <span className="module-link">Open</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="profile-panel">
          <div className="profile-panel-header">
            <div>
              <p className="dashboard-eyebrow">Profile</p>
              <h2>{fullName || storedUser.email}</h2>
            </div>

            <button
              type="button"
              className="profile-edit-trigger"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Close" : "Edit profile"}
            </button>
          </div>

          {!isEditing ? (
            <div className="profile-grid">
              <div className="profile-grid-item profile-grid-item--email">
                <label>Email</label>
                <p>{storedUser.email}</p>
              </div>
              <div className="profile-grid-item">
                <label>Age</label>
                <p>{storedUser.age || "Not provided"}</p>
              </div>
              <div className="profile-grid-item">
                <label>DOB</label>
                <p>{dob || "Not provided"}</p>
              </div>
              <div className="profile-grid-item profile-address">
                <label>Address</label>
                <p>{addressValue || "No address added yet"}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="profile-edit-form">
              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label>First name</label>
                  <input
                    name="firstName"
                    value={formState.firstName}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Middle name</label>
                  <input
                    name="middleName"
                    value={formState.middleName}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Last name</label>
                  <input
                    name="lastName"
                    value={formState.lastName}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formState.age}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="profile-form-group">
                  <label>DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={
                      formState.dob
                        ? new Date(formState.dob).toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={handleFormChange}
                  />
                </div>
                <div className="profile-form-group profile-form-group--full">
                  <label>Street</label>
                  <input
                    name="street"
                    value={formState.street}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="profile-form-group">
                  <label>City</label>
                  <input
                    name="city"
                    value={formState.city}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="profile-form-group">
                  <label>State</label>
                  <input
                    name="state"
                    value={formState.state}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Zip</label>
                  <input
                    name="zip"
                    value={formState.zip}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {message && <div className="profile-form-message">{message}</div>}

              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={() => {
                    setIsEditing(false);
                    setMessage("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
