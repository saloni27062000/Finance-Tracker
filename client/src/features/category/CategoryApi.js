import axios from "axios";

const API_URL = "http://localhost:3000/api/category";

const getToken = () => localStorage.getItem("token");

export const getCategoriesApi = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const createCategoryApi = async (categoryData) => {
  const response = await axios.post(API_URL, categoryData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const updateCategoryApi = async ({ id, categoryData }) => {
  const response = await axios.put(`${API_URL}/${id}`, categoryData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const deleteCategoryApi = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};
