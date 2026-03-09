import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "./components/ui/toaster.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
