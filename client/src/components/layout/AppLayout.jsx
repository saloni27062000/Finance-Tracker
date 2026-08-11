import React from "react";
import SideBar from "../common/Sidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Expenses from "../../pages/Expense/Expenses";
import Transaction from "../../pages/Transaction";
import Category from "../../pages/Category";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register";
import Report from "../../pages/Reports";
import FriendsAndFamily from "../../pages/FriendsAndFamily";
import Investment from "../../pages/investment";
import Bank from "../../pages/Bank/Bank";

function AppLayout() {
  return (
    <div className="app-shell">
      <div className="sidebar-wrapper">
        <SideBar />
      </div>

      <main className="app-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/category" element={<Category />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/friends-and-family" element={<FriendsAndFamily />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/bank" element={<Bank />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppLayout;
