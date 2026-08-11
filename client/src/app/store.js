import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import bankReducer from "../features/bank/bankSlice";
import categoryReducer from "../features/category/categorySlice";
import transactionReducer from "../features/transaction/transactionSlice";
import expenseReducer from "../features/expense/expenseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bank: bankReducer,
    category: categoryReducer,
    transaction: transactionReducer,
    expense: expenseReducer,
  },
});