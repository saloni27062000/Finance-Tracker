import axios from "axios";

const API_URL = "http://localhost:3000/api/transaction";

// ================================
// GET TOKEN
// ================================
const getToken = () => {
  return localStorage.getItem("token");
};

// ================================
// AUTH HEADERS
// ================================
const getHeaders = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ================================
// GET ALL TRANSACTIONS
// Expense page will filter type=expense
// ================================
export const getExpensesApi = async () => {
  const response = await axios.get(
    API_URL,
    getHeaders()
  );

  return response.data;
};

// ================================
// CREATE EXPENSE
// IMPORTANT:
// Backend automatically converts expense
// amount into negative.
// So frontend sends POSITIVE amount.
// ================================
export const createExpenseApi = async (expenseData) => {
  const response = await axios.post(
    API_URL,
    {
      categoryId: expenseData.categoryId,
      amount: Number(expenseData.amount),
      type: "expense",
      description: expenseData.description || "",
    },
    getHeaders()
  );

  return response.data;
};

// ================================
// UPDATE EXPENSE
// ================================
export const updateExpenseApi = async ({
  id,
  expenseData,
}) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    {
      categoryId: expenseData.categoryId,
      amount: Number(expenseData.amount),
      type: "expense",
      description: expenseData.description || "",
    },
    getHeaders()
  );

  return response.data;
};

// ================================
// DELETE EXPENSE
// ================================
export const deleteExpenseApi = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getHeaders()
  );

  return response.data;
};
