import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getBanksApi,
    createBankApi,
    updateBankApi,
    deleteBankApi,
} from "./bankApi";


export const fetchBanks = createAsyncThunk(
    "bank/fetchBanks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getBanksApi();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch banks"
            );
        }
    }
);


export const addBank = createAsyncThunk(
    "bank/addBank",
    async (bankData, { rejectWithValue }) => {
        try {
            const response = await createBankApi(bankData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add bank"
            );
        }
    }
);


export const updateBank = createAsyncThunk(
    "bank/updateBank",
    async (data, { rejectWithValue }) => {
        try {
            const response = await updateBankApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update bank"
            );
        }
    }
);


export const deleteBank = createAsyncThunk(
    "bank/deleteBank",
    async (id, { rejectWithValue }) => {
        try {
            await deleteBankApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete bank"
            );
        }
    }
);


const initialState = {
    banks: [],
    loading: false,
    error: null,
};


const bankSlice = createSlice({
    name: "bank",
    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder

            // GET BANKS
            .addCase(fetchBanks.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchBanks.fulfilled, (state, action) => {
                state.loading = false;
                state.banks = action.payload;
            })

            .addCase(fetchBanks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })



            .addCase(addBank.fulfilled, (state, action) => {
                state.banks.push(action.payload);
            })



            .addCase(updateBank.fulfilled, (state, action) => {
                const index = state.banks.findIndex(
                    bank => bank._id === action.payload._id
                );

                if (index !== -1) {
                    state.banks[index] = action.payload;
                }
            })



            .addCase(deleteBank.fulfilled, (state, action) => {
                state.banks = state.banks.filter(
                    bank => bank._id !== action.payload
                );
            })

    }
});


export default bankSlice.reducer;