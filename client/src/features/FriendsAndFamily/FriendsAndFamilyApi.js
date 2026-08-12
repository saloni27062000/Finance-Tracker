import axios from "axios";

const API_URL = "http://localhost:3000/api/friendsandfamily";

const getToken = () => localStorage.getItem("token");

export const getFriendsAndFamiliesApi = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const createFriendsAndFamilyApi = async (friendsAndFamilyData) => {
  const response = await axios.post(API_URL, friendsAndFamilyData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const updateFriendsAndFamilyApi = async ({ id, friendsAndFamilyData }) => {
  const response = await axios.put(`${API_URL}/${id}`, friendsAndFamilyData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const deleteFriendsAndFamilyApi = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
