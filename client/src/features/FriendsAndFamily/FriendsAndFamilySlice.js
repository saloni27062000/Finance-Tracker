import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getFriendsAndFamiliesApi,
  createFriendsAndFamilyApi,
  updateFriendsAndFamilyApi,
  deleteFriendsAndFamilyApi,
} from "./FriendsAndFamilyApi";

// FETCH FRIENDS AND FAMILY
export const fetchFriendsAndFamilies = createAsyncThunk(
  "friendsAndFamily/fetchFriendsAndFamilies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFriendsAndFamiliesApi();

      console.log("FETCH FRIENDS AND FAMILY RESPONSE:", response);

      if (Array.isArray(response)) {
        return response;
      }

      if (Array.isArray(response?.data)) {
        return response.data;
      }

      if (Array.isArray(response?.friendsAndFamilies)) {
        return response.friendsAndFamilies;
      }

      return [];
    } catch (error) {
      console.error("Fetch friends and family error:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch friends and family list"
      );
    }
  }
);

// ADD FRIENDS AND FAMILY
export const addFriendsAndFamily = createAsyncThunk(
  "friendsAndFamily/addFriendsAndFamily",
  async (friendsAndFamilyData, { rejectWithValue }) => {
    try {
      const response = await createFriendsAndFamilyApi(friendsAndFamilyData);

      console.log("CREATE FRIENDS AND FAMILY RESPONSE:", response);

      return response?.data || response?.friendsAndFamily || response;
    } catch (error) {
      console.error("Create friends and family error:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to add friend or family member"
      );
    }
  }
);

// UPDATE FRIENDS AND FAMILY
export const updateFriendsAndFamily = createAsyncThunk(
  "friendsAndFamily/updateFriendsAndFamily",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateFriendsAndFamilyApi(data);

      console.log("UPDATE FRIENDS AND FAMILY RESPONSE:", response);

      return response?.data || response?.friendsAndFamily || response;
    } catch (error) {
      console.error("Update friends and family error:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to update friend or family member"
      );
    }
  }
);

// DELETE FRIENDS AND FAMILY
export const deleteFriendsAndFamily = createAsyncThunk(
  "friendsAndFamily/deleteFriendsAndFamily",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFriendsAndFamilyApi(id);
      return id;
    } catch (error) {
      console.error("Delete friends and family error:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to delete friend or family member"
      );
    }
  }
);

const initialState = {
  friendsAndFamilies: [],
  loading: false,
  error: null,
};

const friendsAndFamilySlice = createSlice({
  name: "friendsAndFamily",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendsAndFamilies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendsAndFamilies.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.friendsAndFamilies = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchFriendsAndFamilies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.friendsAndFamilies = [];
      })

      .addCase(addFriendsAndFamily.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFriendsAndFamily.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (action.payload) {
          state.friendsAndFamilies.push(action.payload);
        }
      })
      .addCase(addFriendsAndFamily.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateFriendsAndFamily.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFriendsAndFamily.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedItem = action.payload;

        if (!updatedItem?._id) {
          return;
        }

        const index = state.friendsAndFamilies.findIndex(
          (item) => item._id === updatedItem._id
        );

        if (index !== -1) {
          state.friendsAndFamilies[index] = updatedItem;
        }
      })
      .addCase(updateFriendsAndFamily.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteFriendsAndFamily.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFriendsAndFamily.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.friendsAndFamilies = state.friendsAndFamilies.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteFriendsAndFamily.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default friendsAndFamilySlice.reducer;
