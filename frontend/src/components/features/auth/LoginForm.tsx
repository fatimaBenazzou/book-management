"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFormData } from "@/lib/validations";

interface LoginFormProps {
  /** Form submission handler */
  onSubmit: (data: LoginFormData) => void;
  /** Whether the form is submitting */
  isLoading?: boolean;
}

/**
 * LoginForm component - form for user authentication
 */
export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      // Parse and validate with Zod
      const result = loginSchema.safeParse(value);
      if (result.success) {
        onSubmit(result.data);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Email */}
      <form.Field name="email">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter your email"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Password */}
      <form.Field name="password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Password</Label>
            <Input
              id={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter your password"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Remember Me */}
      <form.Field name="rememberMe">
        {(field) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) =>
                field.handleChange(checked === true)
              }
            />
            <Label
              htmlFor={field.name}
              className="text-sm font-normal cursor-pointer"
            >
              Remember me
            </Label>
          </div>
        )}
      </form.Field>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
