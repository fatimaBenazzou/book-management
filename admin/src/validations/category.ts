import { z } from "zod";

// ============================================
// Category Validation
// ============================================

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Name must have at least 3 letters")
    .max(70, "Name must have at most 70 letters"),
});

// Form schema for admin category management
export const categoryFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(70),
});

// Type exports
export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
