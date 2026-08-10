import authReducer from "../features/auth/authSlice";
import bankReducer from "../features/bank/bankSlice";
import categoryReducer from "../features/category/CategorySlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bank: bankReducer,
    category: categoryReducer,
  },
});
