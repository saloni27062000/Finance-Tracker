import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getBanksApi,
  createBankApi,
  updateBankApi,
  deleteBankApi,
} from "./bankApi";


// GET BANKS
export const fetchBanks = createAsyncThunk(
  "bank/fetchBanks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBanksApi();

      console.log("GET BANKS RESPONSE:", response);

      // Supports:
      // []
      // { data: [] }
      // { banks: [] }
      if (Array.isArray(response)) {
        return response;
      }

      if (Array.isArray(response?.data)) {
        return response.data;
      }

      if (Array.isArray(response?.banks)) {
        return response.banks;
      }

      return [];
    } catch (error) {
      console.error("Fetch banks error:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch banks"
      );
    }
  }
);


// ADD BANK
export const addBank = createAsyncThunk(
  "bank/addBank",
  async (bankData, { rejectWithValue }) => {
    try {
      console.log("ADDING BANK:", bankData);

      const response = await createBankApi(bankData);

      console.log("CREATE BANK RESPONSE:", response);

      // Supports:
      // bank object
      // { data: bank }
      // { bank: bank }
      return response?.data || response?.bank || response;
    } catch (error) {
      console.error("Create bank error:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to add bank"
      );
    }
  }
);


// UPDATE BANK
export const updateBank = createAsyncThunk(
  "bank/updateBank",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateBankApi(data);

      console.log("UPDATE BANK RESPONSE:", response);

      return response?.data || response?.bank || response;
    } catch (error) {
      console.error("Update bank error:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to update bank"
      );
    }
  }
);


// DELETE BANK
export const deleteBank = createAsyncThunk(
  "bank/deleteBank",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBankApi(id);

      return id;
    } catch (error) {
      console.error("Delete bank error:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to delete bank"
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

      // FETCH
      .addCase(fetchBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.banks = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(fetchBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.banks = [];
      })


      // ADD
      .addCase(addBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addBank.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (action.payload) {
          state.banks.push(action.payload);
        }
      })

      .addCase(addBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // UPDATE
      .addCase(updateBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateBank.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedBank = action.payload;

        if (!updatedBank?._id) {
          return;
        }

        const index = state.banks.findIndex(
          (bank) => bank._id === updatedBank._id
        );

        if (index !== -1) {
          state.banks[index] = updatedBank;
        }
      })

      .addCase(updateBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // DELETE
      .addCase(deleteBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteBank.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.banks = state.banks.filter(
          (bank) => bank._id !== action.payload
        );
      })

      .addCase(deleteBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default bankSlice.reducer;