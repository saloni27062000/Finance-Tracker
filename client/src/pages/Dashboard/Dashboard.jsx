import React from "react";
import { Link } from "react-router-dom";
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
  const storedUser =
    JSON.parse(localStorage.getItem("currentUser") || "null") ||
    JSON.parse(localStorage.getItem("registeredUser") || "null");

  if (!storedUser) {
    return (
      <div className="login-screen">
        <div className="login-page">
          <h2>No user data found</h2>
          <p>
            Please <Link to="/login">sign in</Link> or <Link to="/register">register</Link> first.
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
  const addressValue = `${address.street || ""} ${address.city || ""} ${address.state || ""} ${address.zip || ""}`.trim();

  const stats = [
    { label: "Modules", value: modules.length + 1, hint: "active areas" },
    { label: "User", value: fullName || storedUser.email, hint: "account owner" },
    { label: "DOB", value: dob || "Not set", hint: "profile info" },
  ];

  const overviewCards = [
    { label: "Income", value: "₹48,500", trend: "+12.5%", tone: "up" },
    { label: "Expenses", value: "₹18,900", trend: "-4.8%", tone: "down" },
    { label: "Savings", value: "₹29,600", trend: "+8.1%", tone: "up" },
    { label: "Remaining", value: "₹12,400", trend: "Healthy", tone: "neutral" },
  ];

  const spendingChart = [
    { label: "Housing", value: 82, color: "#6366f1" },
    { label: "Food", value: 64, color: "#14b8a6" },
    { label: "Bills", value: 58, color: "#f59e0b" },
    { label: "Travel", value: 42, color: "#f97316" },
    { label: "Fun", value: 31, color: "#ec4899" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">Finance control center</p>
            <h1>Welcome back, {fullName || storedUser.email}</h1>
          </div>

          <div className="dashboard-user-pill">
            <span className="dashboard-user-dot" />
            {storedUser.email}
          </div>
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
                  <span className={`trend trend--${card.tone}`}>{card.trend}</span>
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
                        style={{ width: `${item.value}%`, background: item.color }}
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
                  <span>Spent</span>
                  <strong>₹18,900 / ₹30,000</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill progress-fill--primary" style={{ width: "63%" }} />
                </div>
              </div>

              <div className="progress-block">
                <div className="progress-meta">
                  <span>Remaining</span>
                  <strong>₹11,100 left</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill progress-fill--success" style={{ width: "37%" }} />
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
          <div>
            <p className="dashboard-eyebrow">Profile</p>
            <h2>{fullName || storedUser.email}</h2>
          </div>

          <div className="profile-grid">
            <div>
              <label>Email</label>
              <p>{storedUser.email}</p>
            </div>
            <div>
              <label>Age</label>
              <p>{storedUser.age || "Not provided"}</p>
            </div>
            <div>
              <label>DOB</label>
              <p>{dob || "Not provided"}</p>
            </div>
            <div className="profile-address">
              <label>Address</label>
              <p>{addressValue || "No address added yet"}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;