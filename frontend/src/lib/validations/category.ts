import { z } from "zod";

/**
 * Category form validation schema
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(70, "Name must be less than 70 characters"),
});

/**
 * Type inferred from category schema
 */
export type CategoryFormData = z.infer<typeof categorySchema>;
