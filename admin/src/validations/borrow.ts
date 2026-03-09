import { z } from "zod";

// ============================================
// Borrow Validation
// ============================================

export const borrowStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "active",
  "returned",
  "overdue",
  "cancelled",
]);

export const borrowSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  dueDate: z.string().min(1, "Due date is required"),
  comments: z.string().optional(),
});

export const returnBorrowSchema = z.object({
  // No body parameters needed
});

export const processBorrowSchema = z.object({
  action: z.enum(["approve", "reject"], {
    message: "Action must be approve or reject",
  }),
  reason: z.string().optional(),
});

// Form schema for admin borrowing management
export const processBorrowFormSchema = z.object({
  status: z.enum([
    "pending",
    "approved",
    "active",
    "returned",
    "overdue",
    "rejected",
  ]),
  comments: z.string().max(500).optional(),
});

// Type exports
export type BorrowStatus = z.infer<typeof borrowStatusSchema>;
export type BorrowInput = z.infer<typeof borrowSchema>;
export type ProcessBorrowInput = z.infer<typeof processBorrowSchema>;
export type ProcessBorrowFormInput = z.infer<typeof processBorrowFormSchema>;
