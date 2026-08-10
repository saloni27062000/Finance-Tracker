import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getTransactionsApi,
  createTransactionApi,
  updateTransactionApi,
  deleteTransactionApi,
} from "./transactionApi";

// ==================================================
// FETCH TRANSACTIONS
// ==================================================
export const fetchTransactions =
  createAsyncThunk(
    "transaction/fetchTransactions",

    async (_, { rejectWithValue }) => {
      try {
        const response =
          await getTransactionsApi();

        console.log(
          "FETCH TRANSACTIONS:",
          response
        );

        /*
          Supports:

          1. response = []

          2. response = {
               data: []
             }

          3. response = {
               transactions: []
             }
        */

        if (Array.isArray(response)) {
          return response;
        }

        if (Array.isArray(response?.data)) {
          return response.data;
        }

        if (
          Array.isArray(
            response?.transactions
          )
        ) {
          return response.transactions;
        }

        return [];
      } catch (error) {
        console.error(
          "FETCH TRANSACTIONS ERROR:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to fetch transactions"
        );
      }
    }
  );

// ==================================================
// ADD TRANSACTION
// ==================================================
export const addTransaction =
  createAsyncThunk(
    "transaction/addTransaction",

    async (
      transactionData,
      { rejectWithValue }
    ) => {
      try {
        console.log(
          "ADDING TRANSACTION:",
          transactionData
        );

        const response =
          await createTransactionApi(
            transactionData
          );

        console.log(
          "ADD TRANSACTION RESPONSE:",
          response
        );

        /*
          Supports:

          response = transaction

          OR

          response = {
            data: transaction
          }

          OR

          response = {
            transaction: transaction
          }
        */

        return (
          response?.data ||
          response?.transaction ||
          response
        );
      } catch (error) {
        console.error(
          "ADD TRANSACTION ERROR:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to add transaction"
        );
      }
    }
  );

// ==================================================
// UPDATE TRANSACTION
// ==================================================
export const updateTransaction =
  createAsyncThunk(
    "transaction/updateTransaction",

    async (
      data,
      { rejectWithValue }
    ) => {
      try {
        console.log(
          "UPDATING TRANSACTION:",
          data
        );

        const response =
          await updateTransactionApi(
            data
          );

        console.log(
          "UPDATE TRANSACTION RESPONSE:",
          response
        );

        return (
          response?.data ||
          response?.transaction ||
          response
        );
      } catch (error) {
        console.error(
          "UPDATE TRANSACTION ERROR:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to update transaction"
        );
      }
    }
  );

// ==================================================
// DELETE TRANSACTION
// ==================================================
export const deleteTransaction =
  createAsyncThunk(
    "transaction/deleteTransaction",

    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        console.log(
          "DELETING TRANSACTION:",
          id
        );

        await deleteTransactionApi(id);

        return id;
      } catch (error) {
        console.error(
          "DELETE TRANSACTION ERROR:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to delete transaction"
        );
      }
    }
  );

// ==================================================
// INITIAL STATE
// ==================================================
const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

// ==================================================
// SLICE
// ==================================================
const transactionSlice =
  createSlice({
    name: "transaction",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
      builder

        // ==========================================
        // FETCH - PENDING
        // ==========================================
        .addCase(
          fetchTransactions.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        // ==========================================
        // FETCH - SUCCESS
        // ==========================================
        .addCase(
          fetchTransactions.fulfilled,
          (state, action) => {
            state.loading = false;
            state.error = null;

            state.transactions =
              Array.isArray(action.payload)
                ? action.payload
                : [];
          }
        )

        // ==========================================
        // FETCH - ERROR
        // ==========================================
        .addCase(
          fetchTransactions.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch transactions";

            state.transactions = [];
          }
        )

        // ==========================================
        // ADD - PENDING
        // ==========================================
        .addCase(
          addTransaction.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        // ==========================================
        // ADD - SUCCESS
        // ==========================================
        .addCase(
          addTransaction.fulfilled,
          (state, action) => {
            state.loading = false;
            state.error = null;

            if (action.payload) {
              state.transactions.push(
                action.payload
              );
            }
          }
        )

        // ==========================================
        // ADD - ERROR
        // ==========================================
        .addCase(
          addTransaction.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to add transaction";
          }
        )

        // ==========================================
        // UPDATE - PENDING
        // ==========================================
        .addCase(
          updateTransaction.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        // ==========================================
        // UPDATE - SUCCESS
        // ==========================================
        .addCase(
          updateTransaction.fulfilled,
          (state, action) => {
            state.loading = false;
            state.error = null;

            const updatedTransaction =
              action.payload;

            if (
              !updatedTransaction?._id
            ) {
              return;
            }

            const index =
              state.transactions.findIndex(
                (transaction) =>
                  transaction._id ===
                  updatedTransaction._id
              );

            if (index !== -1) {
              state.transactions[index] =
                updatedTransaction;
            }
          }
        )

        // ==========================================
        // UPDATE - ERROR
        // ==========================================
        .addCase(
          updateTransaction.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to update transaction";
          }
        )

        // ==========================================
        // DELETE - PENDING
        // ==========================================
        .addCase(
          deleteTransaction.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        // ==========================================
        // DELETE - SUCCESS
        // ==========================================
        .addCase(
          deleteTransaction.fulfilled,
          (state, action) => {
            state.loading = false;
            state.error = null;

            state.transactions =
              state.transactions.filter(
                (transaction) =>
                  transaction._id !==
                  action.payload
              );
          }
        )

        // ==========================================
        // DELETE - ERROR
        // ==========================================
        .addCase(
          deleteTransaction.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to delete transaction";
          }
        );
    },
  });

export default transactionSlice.reducer;
