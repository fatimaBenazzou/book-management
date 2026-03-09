import { z } from "zod";

// ============================================
// Author Validation
// ============================================

export const authorSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  bio: z.string().optional(),
});

export const authorUpdateSchema = z.object({
  name: z.string().min(1, "Author name is required").optional(),
  bio: z.string().optional(),
});

// Form schema for admin author management
export const authorFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  bio: z.string().max(2000).optional(),
});

// Type exports
export type AuthorInput = z.infer<typeof authorSchema>;
export type AuthorUpdateInput = z.infer<typeof authorUpdateSchema>;
export type AuthorFormInput = z.infer<typeof authorFormSchema>;
