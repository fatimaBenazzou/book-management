import { z } from "zod/v4";

/**
 * MongoDB ObjectId validation regex
 * Validates 24-character hexadecimal string
 */
export const mongoDbIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ID format");

/**
 * Pagination query schema
 * Transforms string query params to numbers with defaults
 */
export const paginationSchema = z.object({
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
});

/**
 * Sort query schema
 * Handles sorting parameters with defaults
 */
export const sortSchema = z.object({
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z
    .enum(["asc", "desc"])
    .optional()
    .default("desc")
    .transform((val) => (val === "asc" ? 1 : -1) as 1 | -1),
});

/**
 * Search query schema
 * Handles search and category filtering
 */
export const searchSchema = z.object({
  search: z.string().optional(),
  category: mongoDbIdSchema.optional(),
});

/**
 * Combined filter schema
 * Includes pagination, sorting, and search
 */
export const filterSchema = sortSchema.and(paginationSchema).and(searchSchema);

/**
 * URL ID params schema
 * Validates :id parameter in routes
 */
export const idParamsSchema = z.object({
  id: mongoDbIdSchema,
});

/**
 * URL bookId params schema
 * Validates :bookId parameter in routes
 */
export const bookIdParamsSchema = z.object({
  bookId: mongoDbIdSchema,
});

// Type exports for use in handlers
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SortQuery = z.infer<typeof sortSchema>;
export type SearchQuery = z.infer<typeof searchSchema>;
export type FilterQuery = z.infer<typeof filterSchema>;
export type IdParams = z.infer<typeof idParamsSchema>;
export type BookIdParams = z.infer<typeof bookIdParamsSchema>;
