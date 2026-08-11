import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getInvestmentsApi,
  createInvestmentApi,
  updateInvestmentApi,
  deleteInvestmentApi,
  recordInvestmentReturnApi,
} from "./investmentApi";

export const fetchInvestments = createAsyncThunk(
  "investment/fetchInvestments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getInvestmentsApi();
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch investments",
      );
    }
  },
);

export const addInvestment = createAsyncThunk(
  "investment/addInvestment",
  async (investmentData, { rejectWithValue }) => {
    try {
      const response = await createInvestmentApi(investmentData);
      return response?.data || response?.investment || response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to add investment",
      );
    }
  },
);

export const updateInvestment = createAsyncThunk(
  "investment/updateInvestment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateInvestmentApi(data);
      return response?.data || response?.investment || response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to update investment",
      );
    }
  },
);

export const deleteInvestment = createAsyncThunk(
  "investment/deleteInvestment",
  async (id, { rejectWithValue }) => {
    try {
      await deleteInvestmentApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to delete investment",
      );
    }
  },
);

export const recordInvestmentReturn = createAsyncThunk(
  "investment/recordInvestmentReturn",
  async ({ id, returnData }, { rejectWithValue }) => {
    try {
      const response = await recordInvestmentReturnApi({ id, returnData });
      return response?.data || response?.investment || response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to record investment return",
      );
    }
  },
);

const initialState = {
  investments: [],
  loading: false,
  error: null,
};

const investmentSlice = createSlice({
  name: "investment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.investments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch investments";
        state.investments = [];
      })
      .addCase(addInvestment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInvestment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.investments.push(action.payload);
        }
      })
      .addCase(addInvestment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add investment";
      })
      .addCase(updateInvestment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvestment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedItem = action.payload;
        if (!updatedItem?._id) return;

        const index = state.investments.findIndex((item) => item._id === updatedItem._id);
        if (index !== -1) {
          state.investments[index] = updatedItem;
        }
      })
      .addCase(updateInvestment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update investment";
      })
      .addCase(deleteInvestment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvestment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.investments = state.investments.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteInvestment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete investment";
      })
      .addCase(recordInvestmentReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordInvestmentReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedItem = action.payload;
        if (!updatedItem?._id) return;

        const index = state.investments.findIndex((item) => item._id === updatedItem._id);
        if (index !== -1) {
          state.investments[index] = updatedItem;
        }
      })
      .addCase(recordInvestmentReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to record investment return";
      });
  },
});

export default investmentSlice.reducer;
