import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/login",
      data,
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    message: "",
    token: "",
    loading: false,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        state.message = action.payload.message;
        state.error = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload.message;
        localStorage.removeItem("token");
      });
  },
});

export default authSlice.reducer;