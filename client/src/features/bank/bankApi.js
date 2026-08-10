import axios from "axios";

const API_URL = "http://localhost:3000/api/bank";

const getToken = () => {
    return localStorage.getItem("token");
};


export const getBanksApi = async () => {
    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return response.data;
};


export const createBankApi = async (bankData) => {
    const response = await axios.post(
        API_URL,
        bankData,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

    return response.data;
};


export const updateBankApi = async ({ id, bankData }) => {
    const response = await axios.put(
        `${API_URL}/${id}`,
        bankData,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

    return response.data;
};


export const deleteBankApi = async (id) => {
    const response = await axios.delete(
        `${API_URL}/${id}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

    return response.data;
};