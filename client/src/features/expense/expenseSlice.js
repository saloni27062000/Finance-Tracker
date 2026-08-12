import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getExpensesApi,
  createExpenseApi,
  updateExpenseApi,
  deleteExpenseApi,
} from "./expenseApi";


// FETCH EXPENSES

export const fetchExpenses = createAsyncThunk(
  "expense/fetchExpenses",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getExpensesApi();

      console.log("EXPENSE API RESPONSE:", response);

      let transactions = [];

      if (Array.isArray(response)) {
        transactions = response;
      } else if (Array.isArray(response?.data)) {
        transactions = response.data;
      } else if (
        Array.isArray(response?.transactions)
      ) {
        transactions = response.transactions;
      }

      // Only expenses
      return transactions.filter(
        (transaction) =>
          transaction?.type === "expense"
      );
    } catch (error) {
      console.error(
        "FETCH EXPENSE ERROR:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch expenses"
      );
    }
  }
);


// ADD EXPENSE

export const addExpense = createAsyncThunk(
  "expense/addExpense",

  async (
    expenseData,
    { rejectWithValue }
  ) => {
    try {
      console.log(
        "ADDING EXPENSE:",
        expenseData
      );

      const response =
        await createExpenseApi(
          expenseData
        );

      console.log(
        "ADD EXPENSE RESPONSE:",
        response
      );

      return (
        response?.data ||
        response?.transaction ||
        response
      );
    } catch (error) {
      console.error(
        "ADD EXPENSE ERROR:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to add expense"
      );
    }
  }
);


// UPDATE EXPENSE

export const updateExpense =
  createAsyncThunk(
    "expense/updateExpense",

    async (
      data,
      { rejectWithValue }
    ) => {
      try {
        console.log(
          "UPDATING EXPENSE:",
          data
        );

        const response =
          await updateExpenseApi(
            data
          );

        console.log(
          "UPDATE EXPENSE RESPONSE:",
          response
        );

        return (
          response?.data ||
          response?.transaction ||
          response
        );
      } catch (error) {
        console.error(
          "UPDATE EXPENSE ERROR:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to update expense"
        );
      }
    }
  );


// DELETE EXPENSE

export const deleteExpense =
  createAsyncThunk(
    "expense/deleteExpense",

    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        console.log(
          "DELETING EXPENSE:",
          id
        );

        await deleteExpenseApi(id);

        return id;
      } catch (error) {
        console.error(
          "DELETE EXPENSE ERROR:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to delete expense"
        );
      }
    }
  );


// INITIAL STATE

const initialState = {
  expenses: [],
  loading: false,
  error: null,
};


// SLICE

const expenseSlice = createSlice({
  name: "expense",

  initialState,

  reducers: {
    clearExpenseError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===============================================
      // FETCH
      // ===============================================
      .addCase(
        fetchExpenses.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchExpenses.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.expenses =
            Array.isArray(action.payload)
              ? action.payload
              : [];
        }
      )

      .addCase(
        fetchExpenses.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch expenses";

          state.expenses = [];
        }
      )

      // ===============================================
      // ADD
      // ===============================================
      .addCase(
        addExpense.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        addExpense.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          if (
            action.payload &&
            action.payload.type === "expense"
          ) {
            state.expenses.unshift(
              action.payload
            );
          }
        }
      )

      .addCase(
        addExpense.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to add expense";
        }
      )

      // ===============================================
      // UPDATE
      // ===============================================
      .addCase(
        updateExpense.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateExpense.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const updatedExpense =
            action.payload;

          if (!updatedExpense?._id) {
            return;
          }

          const index =
            state.expenses.findIndex(
              (expense) =>
                expense._id ===
                updatedExpense._id
            );

          if (index !== -1) {
            state.expenses[index] =
              updatedExpense;
          }
        }
      )

      .addCase(
        updateExpense.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to update expense";
        }
      )

      // ===============================================
      // DELETE
      // ===============================================
      .addCase(
        deleteExpense.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteExpense.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.expenses =
            state.expenses.filter(
              (expense) =>
                expense._id !==
                action.payload
            );
        }
      )

      .addCase(
        deleteExpense.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to delete expense";
        }
      );
  },
});

export const {
  clearExpenseError,
} = expenseSlice.actions;

export default expenseSlice.reducer;