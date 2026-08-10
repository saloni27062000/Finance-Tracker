import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password } = form;
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;
        localStorage.setItem("currentUser", JSON.stringify(payload.user));
        navigate("/dashboard");
      } else {
        setError(
          resultAction.payload?.message || "Login failed. Please try again.",
        );
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-screen">
      <div className="login-page">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              name="email"
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              name="password"
              onChange={handleChange}
              placeholder="Your password"
            />
          </div>

          <button type="submit">Sign in</button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
