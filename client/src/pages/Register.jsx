import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./login.css";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    age: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      firstName,
      middleName,
      lastName,
      email,
      street,
      city,
      state,
      zip,
      age,
      dob,
      password,
      confirmPassword,
    } = form;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !street ||
      !city ||
      !state ||
      !zip ||
      !age ||
      !dob ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        fullname: {
          firstname: firstName,
          middlename: middleName,
          lastname: lastName,
        },
        email,
        password,
        address: {
          street,
          city,
          state,
          zip,
        },
        age: Number(age),
        DOB: dob,
      };

      await axios.post("http://localhost:3000/api/users", payload);
      localStorage.setItem("registeredUser", JSON.stringify(payload));
      navigate("/login");
    } catch (err) {
      console.error(
        "Registration error:",
        err.response?.data || err.message || err,
      );
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-page">
        <h2>Create account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error">{error}</div>}

          <div className="form-group">
            <label>Full name</label>
            <div className="name-row">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
              <input
                name="middleName"
                value={form.middleName}
                onChange={handleChange}
                placeholder="Middle name"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="Street address"
            />
            <div className="address-grid">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
              />
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />
              <input
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="Zip code"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Your age"
            />
          </div>

          <div className="form-group">
            <label>DOB</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </div>

          <button type="submit">Create account</button>
        </form>

        <p>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
