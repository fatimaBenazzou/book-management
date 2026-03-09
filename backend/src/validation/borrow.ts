import { z } from "zod/v4";
import { mongoDbIdSchema } from "./utils.js";

const BORROW_STATUS = [
  "pending",
  "approved",
  "rejected",
  "active",
  "returned",
  "overdue",
  "cancelled",
] as const;

/**
 * Borrow request schema (POST /request)
 * borrowDate / returnDate / bookSerialNo are server-controlled — not accepted from client
 */
export const borrowSchema = z.object({
  bookId: mongoDbIdSchema,
  dueDate: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => date > new Date(), "Due date must be in the future"),
  comments: z.string().max(500, "Too long").optional(),
});

/**
 * Extend borrow schema (POST /:id/extend)
 */
export const extendBorrowSchema = z.object({
  additionalDays: z.number().int().min(1).max(30).optional().default(7),
});

/**
 * Reject borrow schema (POST /:id/reject)
 */
export const rejectBorrowSchema = z.object({
  reason: z.string().max(500, "Too long").optional(),
});

/**
 * Admin borrow list query schema (GET /)
 * Extends pagination with borrow-specific filters and sorting
 */
export const borrowQuerySchema = z.object({
  page: z
    .string()
    .default("1")
    .transform(Number)
    .pipe(z.number().int().min(1, "Page must be a positive integer")),
  limit: z
    .string()
    .default("10")
    .transform(Number)
    .pipe(
      z
        .number()
        .int()
        .min(1, "Limit must be a positive integer")
        .max(100, "Limit cannot exceed 100"),
    ),
  sortBy: z
    .enum(["createdAt", "dueDate", "borrowDate", "status"] as const)
    .optional()
    .default("createdAt"),
  sortOrder: z
    .enum(["asc", "desc"] as const)
    .optional()
    .default("desc")
    .transform((val) => (val === "asc" ? 1 : -1) as 1 | -1),
  status: z.enum(BORROW_STATUS).optional(),
  user: mongoDbIdSchema.optional(),
  book: mongoDbIdSchema.optional(),
});

// Type exports
export type BorrowInput = z.infer<typeof borrowSchema>;
export type ExtendBorrowInput = z.infer<typeof extendBorrowSchema>;
export type RejectBorrowInput = z.infer<typeof rejectBorrowSchema>;
export type BorrowQueryInput = z.infer<typeof borrowQuerySchema>;
