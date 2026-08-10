import axios from "axios";

const API_URL = "http://localhost:3000/api/transaction";

// =========================
// GET TOKEN
// =========================
const getToken = () => {
  return localStorage.getItem("token");
};

// =========================
// AUTH HEADERS
// =========================
const getHeaders = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// =========================
// GET ALL TRANSACTIONS
// =========================
export const getTransactionsApi = async () => {
  const response = await axios.get(
    API_URL,
    getHeaders()
  );

  console.log(
    "GET TRANSACTIONS RESPONSE:",
    response.data
  );

  return response.data;
};

// =========================
// CREATE TRANSACTION
// =========================
export const createTransactionApi = async (
  transactionData
) => {
  console.log(
    "CREATE TRANSACTION DATA:",
    transactionData
  );

  const response = await axios.post(
    API_URL,
    transactionData,
    getHeaders()
  );

  console.log(
    "CREATE TRANSACTION RESPONSE:",
    response.data
  );

  return response.data;
};

// =========================
// UPDATE TRANSACTION
// =========================
export const updateTransactionApi = async ({
  id,
  transactionData,
}) => {
  console.log(
    "UPDATE TRANSACTION ID:",
    id
  );

  console.log(
    "UPDATE TRANSACTION DATA:",
    transactionData
  );

  const response = await axios.put(
    `${API_URL}/${id}`,
    transactionData,
    getHeaders()
  );

  console.log(
    "UPDATE TRANSACTION RESPONSE:",
    response.data
  );

  return response.data;
};

// =========================
// DELETE TRANSACTION
// =========================
export const deleteTransactionApi = async (
  id
) => {
  console.log(
    "DELETE TRANSACTION ID:",
    id
  );

  const response = await axios.delete(
    `${API_URL}/${id}`,
    getHeaders()
  );

  console.log(
    "DELETE TRANSACTION RESPONSE:",
    response.data
  );

  return response.data;
};