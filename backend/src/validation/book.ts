import { z } from "zod/v4";
import { mongoDbIdSchema } from "./utils.js";

/**
 * Book schema
 * Validates book creation and update data
 */
export const bookSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    author: mongoDbIdSchema,
    serialNumber: z
      .string()
      .min(1, "Serial number is required")
      .regex(/^BK-\d{5}$/, "Serial number must be in format BK-XXXXX"),
    price: z.object({
      original: z.number().min(0, "Original price must be positive").optional(),
      current: z.number().min(0, "Current price must be positive"),
    }),
    rentalPrice: z.number().min(0, "Rental price must be positive"),
    lateFeePerDay: z.number().min(0, "Late fee per day must be positive"),
    totalStock: z
      .number()
      .min(0, "Total stock must be a positive integer")
      .optional(),
    availableStock: z
      .number()
      .min(0, "Available stock must be a positive integer")
      .optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    cover: z.url("Cover must be a valid URL").optional(),
    keywords: z.array(z.string()).optional(),
    category: mongoDbIdSchema.optional(),
  })
  .refine(
    (data) => {
      // Ensure availableStock does not exceed totalStock
      if (data.availableStock !== undefined && data.totalStock !== undefined) {
        return data.availableStock <= data.totalStock;
      }
      return true;
    },
    {
      message: "Available stock cannot exceed total stock",
      path: ["availableStock"],
    },
  );

export const bookUpdateSchema = bookSchema.partial();

/**
 * Book query schema for GET /api/books
 */
export const bookQuerySchema = z.object({
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
    .enum(["createdAt", "title", "price.current", "avgRating", "ratingCount"])
    .optional()
    .default("createdAt"),
  sortOrder: z
    .enum(["asc", "desc"])
    .optional()
    .default("desc")
    .transform((val) => (val === "asc" ? 1 : -1) as 1 | -1),
  search: z.string().optional(),
  category: mongoDbIdSchema.optional(),
  author: mongoDbIdSchema.optional(),
  minPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  maxPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  status: z.enum(["in-shelf", "out-of-stock"]).optional(),
  availability: z.enum(["inStock", "outOfStock"]).optional(),
});

/**
 * Params schema for book rating routes with :id and :ratingId
 */
export const bookRatingParamsSchema = z.object({
  id: mongoDbIdSchema,
  ratingId: mongoDbIdSchema,
});

// Type exports
export type BookInput = z.infer<typeof bookSchema>;
export type BookUpdateInput = z.infer<typeof bookUpdateSchema>;
export type BookQueryInput = z.infer<typeof bookQuerySchema>;
