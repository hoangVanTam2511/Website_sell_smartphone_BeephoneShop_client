import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../utils/status";

const initialState = {
    searchProducts: [],
    searchProductsStatus: STATUS.IDLE
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearch: (state, action) => {
            state.searchProducts = [];
        }
    }
})


export const { setSearchTerm, clearSearch } = searchSlice.actions;
export const getSearchProducts = (state) => state.search.searchProducts;
export const getSearchProductsStatus = (state) => state.search.searchProductsStatus;
export default searchSlice.reducer;