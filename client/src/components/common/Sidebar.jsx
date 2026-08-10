import React from "react";
import { NavLink } from "react-router-dom";

function SideBar() {
  const links = [
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/expenses", label: "Expenses" },
    { to: "/category", label: "Category" },
    { to: "/transaction", label: "Transaction" },
    { to: "/friends-and-family", label: "Friends & Family" },
    { to: "/investment", label: "Investment" },
    { to: "/bank", label: "Bank" },
    { to: "/report", label: "Report" },
  ];

  const storedUser =
    JSON.parse(localStorage.getItem("currentUser") || "null") ||
    JSON.parse(localStorage.getItem("registeredUser") || "null");

  const fullName = storedUser
    ? [
      storedUser.fullname?.firstname,
      storedUser.fullname?.middlename,
      storedUser.fullname?.lastname,
    ]
      .filter(Boolean)
      .join(" ")
    : "";

  const displayName = fullName || storedUser?.email || "";

  const containerStyle = {
    background: "linear-gradient(180deg, #0f172a 0%, #0b1220 100%)",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px 12px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
  };

  const brandStyle = {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: ".4px",
    marginBottom: 2,
    textAlign: "center",
  };

  const nameStyle = {
    marginTop: 8,
    marginBottom: 18,
    textAlign: "center",
    fontSize: 14,
    color: "#cbd5e1",
  };

  const ulStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
  };

  const liStyle = {
    marginBottom: 8,
  };

  const linkStyle = {
    display: "block",
    padding: "10px 12px",
    color: "rgba(255,255,255,0.9)",
    textDecoration: "none",
    borderRadius: 8,
    fontWeight: 500,
    transition: "background .12s ease, transform .06s ease",
  };

  const activeStyle = {
    background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(6,182,212,0.12)",
  };

  return (
    <aside style={containerStyle}>
      <div style={brandStyle}>ExpenseApp</div>
      {displayName && <div style={nameStyle}>{displayName}</div>}

      <nav>
        <ul style={ulStyle}>
          {links.map((l) => (
            <li key={l.to} style={liStyle}>
              <NavLink
                to={l.to}
                style={({ isActive }) =>
                  isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default SideBar;
