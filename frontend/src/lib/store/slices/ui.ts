import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  mobileMenuOpen: boolean;
}

const initialState: UIState = {
  mobileMenuOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const { setMobileMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;
