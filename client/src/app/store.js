import authReducer from "../features/auth/authSlice";
import bankReducer from "../features/bank/bankSlice";
import transactionReducer from  "../features/transaction/transactionSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bank: bankReducer,
    transaction: transactionReducer,
  },
});