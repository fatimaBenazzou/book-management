import { z } from "zod";
import { mongoDbIdSchema } from "./common";

// ============================================
// Book Validation
// ============================================

export const bookPriceSchema = z.object({
  original: z.number().min(0, "Original price must be positive").optional(),
  current: z.number().min(0, "Current price must be positive"),
});

export const bookSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author ID is required"),
    serialNumber: z
      .string()
      .min(1, "Serial number is required")
      .regex(/^BK-\d{5}$/, "Serial number must be in format BK-XXXXX"),
    price: bookPriceSchema,
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
    cover: z.string().url("Cover must be a valid URL").optional(),
    keywords: z.array(z.string()).optional(),
    category: mongoDbIdSchema.optional(),
  })
  .refine(
    (data) => {
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

// Form schema for admin book management
export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  author: z.string().min(1, "Author is required"),
  category: z.string().optional(),
  description: z.string().max(2000),
  cover: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  keywords: z.string(), // comma separated
  totalStock: z.number().int().min(0),
  availableStock: z.number().int().min(0),
  priceOriginal: z.number().min(0).optional(),
  priceCurrent: z.number().min(0),
  rentalPrice: z.number().min(0),
  lateFeePerDay: z.number().min(0),
});

// Type exports
export type BookPriceInput = z.infer<typeof bookPriceSchema>;
export type BookInput = z.infer<typeof bookSchema>;
export type BookFormInput = z.infer<typeof bookFormSchema>;
