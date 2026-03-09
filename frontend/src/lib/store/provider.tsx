"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import type { ReactNode } from "react";

interface StoreProviderProps {
  children: ReactNode;
}

/**
 * Redux Store Provider component
 * Wraps the application with Redux Provider for state management
 */
export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
