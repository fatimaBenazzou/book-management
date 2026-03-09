"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Background } from "@/components/shared/Background";
import { useAppSelector } from "@/lib/store";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Auth Layout - used for login, register, and other auth pages
 * Redirects authenticated users to the home page
 * Displays centered card with background image
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const { isLoggedIn } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Redirect to home if already logged in
    if (isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  // Don't render auth pages if already logged in
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-auto py-8">
      <Background />
      <Card className="z-10 my-auto w-full max-w-lg shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
          {/* Logo and title */}
          <div className="mb-4 flex flex-col items-center gap-2">
            <Image
              src="/logo.png"
              alt="Library Management"
              width={128}
              height={128}
              className="h-32 w-32"
              priority
            />
            <h1 className="text-2xl font-bold">Library Management</h1>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
