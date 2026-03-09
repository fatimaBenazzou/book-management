import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * User state interface matching reference project
 */
interface UserState {
  user: UserI | null;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

/**
 * Initial state - load from localStorage or sessionStorage if available
 */
function getInitialState(): UserState {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isLoggedIn: false,
      isAdmin: false,
    };
  }

  // Check localStorage first (rememberMe was true)
  let storedAuth = localStorage.getItem("auth");

  // If not in localStorage, check sessionStorage
  if (!storedAuth) {
    storedAuth = sessionStorage.getItem("auth");
  }

  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth) as { user: UserI; token: string };
      if (!parsed.user || !parsed.token) {
        return { user: null, token: null, isLoggedIn: false, isAdmin: false };
      }
      return {
        user: parsed.user,
        token: parsed.token,
        isLoggedIn: true,
        isAdmin: parsed.user?.role === "admin",
      };
    } catch {
      // Invalid JSON, return default state
      return {
        user: null,
        token: null,
        isLoggedIn: false,
        isAdmin: false,
      };
    }
  }

  return {
    user: null,
    token: null,
    isLoggedIn: false,
    isAdmin: false,
  };
}

/**
 * User slice for managing authentication state
 * Follows pattern from reference project
 */
export const userSlice = createSlice({
  name: "user",
  initialState: getInitialState(),
  reducers: {
    /**
     * Login action - sets user data and auth flags
     * Note: Storage is handled by the auth API based on rememberMe preference
     */
    login: (
      state,
      action: PayloadAction<{ user: UserI | SafeUserI; token: string }>,
    ) => {
      state.user = action.payload.user as UserI;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.isAdmin = action.payload.user?.role === "admin";
    },

    /**
     * Logout action - clears all auth state
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isAdmin = false;

      // Remove from both localStorage and sessionStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
        localStorage.removeItem("rememberMe");
        sessionStorage.removeItem("auth");
      }
    },

    updateUser: (state, action: PayloadAction<Partial<UserI>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (action.payload.role) {
          state.isAdmin = action.payload.role === "admin";
        }

        if (typeof window !== "undefined" && state.token) {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              user: state.user,
              token: state.token,
            }),
          );
        }
      }
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
