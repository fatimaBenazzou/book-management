"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/features/auth";
import { useLogin } from "@/lib/hooks";
import { toast } from "sonner";
import type { LoginFormData } from "@/lib/validations";

/**
 * Login page - user authentication
 * Uses AuthLayout for consistent styling across auth pages
 */
export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      toast.success("Login successful");

      // Check for redirect destination stored before login
      const redirectTo =
        typeof window !== "undefined"
          ? sessionStorage.getItem("redirectAfterLogin")
          : null;

      if (redirectTo) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid email or password";
      toast.error(message);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm onSubmit={handleSubmit} isLoading={loginMutation.isPending} />
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
