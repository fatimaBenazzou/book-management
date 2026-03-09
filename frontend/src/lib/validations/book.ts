import { z } from "zod";

/**
 * Book price schema
 */
export const bookPriceSchema = z.object({
  original: z.coerce
    .number()
    .min(0, "Original price must be positive")
    .optional(),
  current: z.coerce.number().min(0, "Current price must be positive"),
});

/**
 * Book form validation schema
 */
export const bookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  author: z.string().min(1, "Author is required"),
  serialNumber: z
    .string()
    .regex(/^BK-\d{5}$/, "Serial number must follow BK-XXXXX format"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  price: bookPriceSchema,
  rentalPrice: z.coerce.number().min(0, "Rental price must be positive"),
  lateFeePerDay: z.coerce.number().min(0, "Late fee must be positive"),
  totalStock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .optional(),
  cover: z
    .string()
    .url("Cover must be a valid URL")
    .optional()
    .or(z.literal("")),
  keywords: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    )
    .optional(),
  category: z.string().optional(),
});

/**
 * Type inferred from book schema
 */
export type BookFormData = z.infer<typeof bookSchema>;
