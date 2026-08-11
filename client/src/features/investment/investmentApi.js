import axios from "axios";

const API_URL = "http://localhost:3000/api/investment";

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

export const getInvestmentsApi = async () => {
  const response = await axios.get(API_URL, getHeaders());
  return response.data?.data ?? response.data ?? [];
};

export const createInvestmentApi = async (investmentData) => {
  const response = await axios.post(API_URL, investmentData, getHeaders());
  return response.data?.data ?? response.data;
};

export const updateInvestmentApi = async ({ id, investmentData }) => {
  const response = await axios.put(`${API_URL}/${id}`, investmentData, getHeaders());
  return response.data?.data ?? response.data;
};

export const deleteInvestmentApi = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
  return response.data?.data ?? response.data;
};

export const recordInvestmentReturnApi = async ({ id, returnData }) => {
  const response = await axios.patch(`${API_URL}/${id}/return`, returnData, getHeaders());
  return response.data?.data ?? response.data;
};
