import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function SideBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

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

  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("registeredUser");
    closeMobileMenu();
    navigate("/login");
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        aria-label="Toggle navigation"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">ExpenseApp</div>
          <button
            type="button"
            className="sidebar-close"
            aria-label="Close sidebar"
            onClick={closeMobileMenu}
          >
            ×
          </button>
        </div>

        {displayName && <div className="sidebar-user">{displayName}</div>}

        <nav className="sidebar-nav" aria-label="Main navigation">
          <ul>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} onClick={closeMobileMenu}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>
    </>
  );
}

export default SideBar;
