"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft, LogIn, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/lib/store";

/**
 * Unauthorized page - shown when user tries to access a protected resource
 * without proper authentication
 */
export default function UnauthorizedPage() {
  const router = useRouter();
  const { isLoggedIn } = useAppSelector((state) => state.user);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            {isLoggedIn
              ? "You don't have permission to access this page."
              : "You need to be logged in to access this page."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            {!isLoggedIn && (
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
