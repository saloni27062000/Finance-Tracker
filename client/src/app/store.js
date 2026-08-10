import authReducer from "../features/auth/authSlice";
import bankReducer from "../features/bank/bankSlice";

import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bank: bankReducer,
  },
});