import { z } from "zod";

/**
 * Author form validation schema
 */
export const authorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  bio: z
    .string()
    .max(1000, "Biography must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

/**
 * Type inferred from author schema
 */
export type AuthorFormData = z.infer<typeof authorSchema>;
