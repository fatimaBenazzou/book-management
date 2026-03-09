import { z } from "zod";

/**
 * Borrow form validation schema
 */
export const borrowSchema = z.object({
  bookId: z.string().min(1, "Please select a book"),
  dueDate: z.string().min(1, "Due date is required"),
  comments: z
    .string()
    .max(500, "Comments must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

/**
 * Borrow approval/rejection schema
 */
export const borrowUpdateSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z
    .string()
    .max(500, "Rejection reason must be less than 500 characters")
    .optional(),
});

/**
 * Types inferred from schemas
 */
export type BorrowFormData = z.infer<typeof borrowSchema>;
export type BorrowUpdateFormData = z.infer<typeof borrowUpdateSchema>;
