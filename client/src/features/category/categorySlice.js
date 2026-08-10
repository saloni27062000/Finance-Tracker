import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getCategoriesApi,
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi,
} from "./categoryApi";

export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCategoriesApi();
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch categories",
            );
        }
    },
);

export const addCategory = createAsyncThunk(
    "category/addCategory",
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await createCategoryApi(categoryData);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add category",
            );
        }
    },
);

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await updateCategoryApi(data);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update category",
            );
        }
    },
);

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            await deleteCategoryApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete category",
            );
        }
    },
);

const initialState = {
    categories: [],
    loading: false,
    error: null,
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
                state.error = null;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(
                    (category) => category._id === action.payload._id,
                );

                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(
                    (category) => category._id !== action.payload,
                );
            });
    },
});

export default categorySlice.reducer;
