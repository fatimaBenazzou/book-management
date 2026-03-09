import { z } from "zod";

/**
 * Password regex — must match backend loginSchema
 * Requires: 1 uppercase, 1 lowercase, 1 digit, minimum 8 characters
 */
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .regex(
      passwordRegex,
      "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
    ),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Register form validation schema
 */
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters")
      .max(70, "First name must be at most 70 characters"),
    lastName: z
      .string()
      .min(3, "Last name must be at least 3 characters")
      .max(70, "Last name must be at most 70 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional().or(z.literal("")),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Change password validation schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

/**
 * Update profile validation schema
 */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .optional()
    .or(z.literal("")),
});

/**
 * Types inferred from schemas
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
