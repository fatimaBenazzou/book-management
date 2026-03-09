"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterForm } from "@/components/features/auth";
import { useRegister } from "@/lib/hooks";
import { toast } from "sonner";
import type { RegisterFormData } from "@/lib/validations";

/**
 * Register page - user registration
 * Uses AuthLayout for consistent styling across auth pages
 */
export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      // Strip confirmPassword before sending to backend
      const { confirmPassword: _, ...registerData } = data;
      await registerMutation.mutateAsync(registerData);
      toast.success("Account created! Welcome to the library.");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create account";
      toast.error(message);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Create Account</h2>
        <p className="text-sm text-muted-foreground">
          Register to start managing your books
        </p>
      </div>
      <RegisterForm
        onSubmit={handleSubmit}
        isLoading={registerMutation.isPending}
      />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
