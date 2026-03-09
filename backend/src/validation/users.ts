import { z } from "zod/v4";

/**
 * Password validation regex
 * Requires: 1 uppercase, 1 lowercase, 1 digit, minimum 8 characters
 */
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

/**
 * Login schema
 * Validates email and password for authentication
 */
export const loginSchema = z.object({
  email: z.email("Email must be valid").trim().toLowerCase(),
  password: z.string().regex(passwordRegex, "Password isn't strong enough"),
});

/**
 * User registration schema
 * Extends login with personal information
 */
const userSchema = loginSchema.extend({
  firstName: z
    .string()
    .min(3, "First name must have at least 3 letters")
    .max(70, "First name must have at most 70 letters"),
  lastName: z
    .string()
    .min(3, "Last name must have at least 3 letters")
    .max(70, "Last name must have at most 70 letters"),
  phone: z
    .string()
    .optional()
    .transform((val) => val || null),
  avatar: z
    .url()
    .optional()
    .transform((val) => val || null),
});

export { userSchema };

/**
 * Full user schema (Admin)
 * Includes role assignment
 */
export const fullUserSchema = userSchema.extend({
  role: z.enum(["admin", "user"]).optional(),
});

/**
 * Profile update schema
 * Allows partial updates to user profile
 */
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must have at least 3 letters")
    .max(70, "First name must have at most 70 letters")
    .optional(),
  lastName: z
    .string()
    .min(3, "Last name must have at least 3 letters")
    .max(70, "Last name must have at most 70 letters")
    .optional(),
  phone: z.string().optional().or(z.literal("")),
  avatar: z.url("Avatar must be a valid URL").optional().or(z.literal("")),
});

/**
 * Change password schema
 * Validates current and new password
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .regex(passwordRegex, "New password isn't strong enough"),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type FullUserInput = z.infer<typeof fullUserSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export default userSchema;
