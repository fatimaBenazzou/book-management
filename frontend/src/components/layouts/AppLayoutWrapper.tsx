"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Navigation, Header } from "@/components/layouts";

interface AppLayoutWrapperProps {
  children: ReactNode;
}

/**
 * Paths that should NOT show the sidebar/header (auth pages)
 */
const AUTH_PATHS = ["/auth/login", "/auth/register", "/auth"];

/**
 * AppLayoutWrapper - conditionally wraps content with navigation
 * Auth pages are rendered without the sidebar/header
 * Main app pages are rendered with the full dashboard layout
 */
export function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  const pathname = usePathname();

  // Check if current path is an auth path
  const isAuthPath = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  // Auth pages - render without navigation
  if (isAuthPath) {
    return <>{children}</>;
  }

  // Main app - render with navigation and header
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="flex flex-1 flex-col md:ml-64">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
