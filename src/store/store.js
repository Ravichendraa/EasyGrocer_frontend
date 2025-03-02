import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setTokenFromSession } from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import shopProductsSlice from "./shop/products-slice";
import shopCartSlice, { fetchCartItems } from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import commonFeatureSlice from "./common-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    commonFeature: commonFeatureSlice,
  },
});

// Retrieve the auth token from session storage and update Redux store
const token = sessionStorage.getItem("authToken");
console.log("Retrieved token from sessionStorage on page load:", token);

if (token) {
  store.dispatch(setTokenFromSession({ token }));
  console.log("Token set in Redux from sessionStorage:", token);
}

// Fetch the cart items from the server and update Redux store
const userId = store.getState().auth.user?.id;
if (userId) {
  store.dispatch(fetchCartItems(userId));
}

export default store;
