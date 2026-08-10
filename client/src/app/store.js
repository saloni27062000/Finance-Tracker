import authReducer from "../features/auth/authSlice";
import bankReducer from "../features/bank/bankSlice";
<<<<<<< HEAD
import categoryReducer from "../features/category/CategorySlice";
=======
import categoryReducer from "../features/category/categorySlice";
import transactionReducer from "../features/transaction/transactionSlice";
>>>>>>> origin/master
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bank: bankReducer,
    category: categoryReducer,
<<<<<<< HEAD
=======
    transaction: transactionReducer,
>>>>>>> origin/master
  },
});
