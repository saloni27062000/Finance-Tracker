import React, { useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [selectedField, setSelectedField] = useState(null);
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

  const dob = storedUser.dob || storedUser.DOB || "";
  const passwordMask = storedUser.password ? "•".repeat(storedUser.password.length) : "";
  const address = storedUser.address || {};
  const addressValue = `${address.street || ""} ${address.city || ""} ${address.state || ""} ${address.zip || ""}`.trim();

  const details = [
    { label: "Full Name", value: fullName },
    { label: "Email", value: storedUser.email },
    { label: "Age", value: storedUser.age || "" },
    { label: "DOB", value: dob },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fb" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2rem",
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>User Overview</h1>
          <p style={{ margin: "0.5rem 0 0", color: "#555" }}>
            Welcome back, <strong>{fullName || storedUser.email}</strong>
          </p>
        </div>

        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setSelectedField("email")}
            style={{
              background: "transparent",
              border: "none",
              color: "#1f69ff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            {storedUser.email}
          </button>
        </nav>
      </header>

      <main style={{ padding: "2rem" }}>
        <div style={{ maxWidth: "920px", margin: "0 auto" }}>
          <div
            style={{
              minHeight: "300px",
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 18px 45px rgba(0,0,0,0.06)",
            }}
          >
            {!selectedField ? (
              <div style={{ height: "240px" }} />
            ) : (
              <div>
                <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>
                  {selectedField === "name" ? "User details" : "Email details"}
                </h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {details.map((item) => (
                      <tr key={item.label}>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            width: "180px",
                            fontWeight: 600,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          {item.label}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer
        style={{
          padding: "1.5rem 2rem",
          background: "#fff",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1rem", color: "#333" }}>Address</h2>
        <p style={{ margin: "0.5rem 0 0", color: "#555" }}>
          {addressValue}
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;