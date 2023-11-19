import { createSlice} from "@reduxjs/toolkit";
import {STATUS} from "../utils/status";

const initialState = {
    categories: [],
    categoriesStatus: STATUS.IDLE,
    categoryProducts: [],
    categoryProductsStatus: STATUS.IDLE
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
});

export const getAllCategories = (state) => state.category.categories;
export const getAllProductsByCategory = (state) => state.category.categoryProducts;
export const getCategoryProductsStatus = (state) => state.category.categoryProductsStatus;
export default categorySlice.reducer;