import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import userReducer from "./slices/user";
import cartReducer from "./slices/cart";
import uiReducer from "./slices/ui";

/**
 * Configure Redux store with all slices
 */
export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    ui: uiReducer,
  },
});

/**
 * Root state type inferred from store
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * App dispatch type inferred from store
 */
export type AppDispatch = typeof store.dispatch;

/**
 * Typed useDispatch hook
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed useSelector hook
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
