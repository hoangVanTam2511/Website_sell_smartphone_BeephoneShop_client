import {configureStore} from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";
import categoryReducer from "./categorySlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import searchReducer from "./searchSlice";
import userReducer from "./userSlice";
import navbarSlice from "./navbarSlice";
import cartDetailSlice from "./cartDetailSlice";

const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        category: categoryReducer,
        product: productReducer,
        cart: cartReducer,
        search: searchReducer,
        user: userReducer,
        navbar: navbarSlice,
        cartDetail: cartDetailSlice
    }
});

export default store;