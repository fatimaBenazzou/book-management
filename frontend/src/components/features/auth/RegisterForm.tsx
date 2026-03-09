"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterFormData } from "@/lib/validations";

interface RegisterFormProps {
  /** Form submission handler */
  onSubmit: (data: RegisterFormData) => void;
  /** Whether the form is submitting */
  isLoading?: boolean;
}

/**
 * RegisterForm component - form for user registration
 */
export function RegisterForm({
  onSubmit,
  isLoading = false,
}: RegisterFormProps) {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      // Parse and validate with Zod
      const result = registerSchema.safeParse(value);
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
      {/* First Name */}
      <form.Field name="firstName">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>First Name</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter your first name"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Last Name */}
      <form.Field name="lastName">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Last Name</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter your last name"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

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

      {/* Phone */}
      <form.Field name="phone">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>
              Phone <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id={field.name}
              type="tel"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter your phone number"
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

      {/* Confirm Password */}
      <form.Field name="confirmPassword">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Confirm Password</Label>
            <Input
              id={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Confirm your password"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
