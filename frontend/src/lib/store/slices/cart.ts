import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

/**
 * Cart item interface
 */
interface CartItem {
  bookId: string;
  title: string;
  price: number;
  cover?: string;
  quantity: number;
}

/**
 * Cart state interface
 */
interface CartState {
  items: CartItem[];
  total: number;
}

/**
 * Initial state - load from localStorage if available
 */
function getInitialState(): CartState {
  if (typeof window === "undefined") {
    return {
      items: [],
      total: 0,
    };
  }

  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    return JSON.parse(storedCart) as CartState;
  }

  return {
    items: [],
    total: 0,
  };
}

/**
 * Calculate total from items
 */
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Persist cart to localStorage
 */
function persistCart(state: CartState): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(state));
  }
}

/**
 * Cart slice for managing shopping cart state
 */
export const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    /**
     * Add item to cart - accepts either a CartItem or a Book object
     */
    addToCart: (
      state,
      action: PayloadAction<
        (Omit<CartItem, "quantity"> & { quantity?: number }) | BookI
      >,
    ) => {
      // Handle Book object
      const payload = action.payload;
      let cartItem: Omit<CartItem, "quantity"> & { quantity?: number };

      if ("_id" in payload && !("bookId" in payload)) {
        // This is a Book object
        cartItem = {
          bookId: payload._id,
          title: payload.title,
          price: payload.price?.current ?? 0,
          cover: payload.cover,
          quantity: 1,
        };
      } else {
        // This is already a CartItem-like object
        cartItem = payload as Omit<CartItem, "quantity"> & {
          quantity?: number;
        };
      }

      const existingItem = state.items.find(
        (item) => item.bookId === cartItem.bookId,
      );

      if (existingItem) {
        existingItem.quantity += cartItem.quantity ?? 1;
      } else {
        state.items.push({
          ...cartItem,
          quantity: cartItem.quantity ?? 1,
        });
      }

      state.total = calculateTotal(state.items);
      persistCart(state);
    },

    /**
     * Remove item from cart
     */
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.bookId !== action.payload,
      );
      state.total = calculateTotal(state.items);
      persistCart(state);
    },

    /**
     * Update item quantity
     */
    updateQuantity: (
      state,
      action: PayloadAction<{ bookId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (item) => item.bookId === action.payload.bookId,
      );

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.bookId !== action.payload.bookId,
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }

      state.total = calculateTotal(state.items);
      persistCart(state);
    },

    /**
     * Clear entire cart
     */
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      persistCart(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

/**
 * Selector to check if a book is in the cart
 */
export const selectIsInCart = (state: RootState, bookId: string): boolean =>
  state.cart.items.some((item) => item.bookId === bookId);

/**
 * Selector to get cart item by book ID
 */
export const selectCartItem = (state: RootState, bookId: string) =>
  state.cart.items.find((item) => item.bookId === bookId);

/**
 * Selector to get cart items count
 */
export const selectCartItemsCount = (state: RootState): number =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;
