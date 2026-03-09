import { z } from "zod/v4";
import { mongoDbIdSchema, paginationSchema } from "./utils.js";

/**
 * Shipping address schema
 * Used for delivery orders
 */
const shippingAddressSchema = z.object({
  fullName: z.string().optional(),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone number is required"),
  instructions: z.string().optional(),
});

/**
 * Cart schema
 * Validates shopping cart for order creation
 */
export const cartSchema = z
  .object({
    books: z
      .array(
        z.object({
          bookId: mongoDbIdSchema,
          quantity: z.number().min(1, "Quantity must be at least 1"),
        }),
      )
      .min(1, "Order must contain at least one item"),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    shippingAddress: shippingAddressSchema.optional(),
    paymentMethod: z.enum(["cash_on_delivery"]).optional(),
    orderNotes: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      // If delivery method is 'delivery', shippingAddress is required
      if (data.deliveryMethod === "delivery") {
        return (
          data.shippingAddress !== undefined && data.shippingAddress !== null
        );
      }
      return true;
    },
    {
      message: "Shipping address is required for delivery orders",
      path: ["shippingAddress"],
    },
  );

/**
 * Full order schema
 * Used for admin order updates
 */
export const orderSchema = z.object({
  userId: mongoDbIdSchema,
  books: z.array(
    z.object({
      bookId: mongoDbIdSchema,
      title: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    }),
  ),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  shippingFee: z.number().min(0, "Shipping fee must be positive"),
  totalPrice: z.number().min(0, "Total price must be positive"),
  deliveryMethod: z.enum(["pickup", "delivery"]),
  shippingAddress: shippingAddressSchema.optional(),
  paymentMethod: z.enum(["cash_on_delivery"]),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "completed",
  ]),
  orderNotes: z.string().max(500).optional(),
  trackingNumber: z.string().optional(),
});

/**
 * Update order status schema (Admin)
 * Validates body when an admin changes order status
 */
export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "completed",
  ]),
  note: z.string().max(500).optional(),
});

/**
 * Cancel order schema (User)
 * Validates optional cancellation reason
 */
export const cancelOrderSchema = z.object({
  reason: z.string().max(500).optional(),
});

/**
 * Admin order list query schema
 * Extends pagination with order-specific filters and sorting
 */
export const orderQuerySchema = paginationSchema.and(
  z.object({
    status: z
      .enum([
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "completed",
      ])
      .optional(),
    sortBy: z
      .enum(["createdAt", "totalPrice", "status", "updatedAt"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    userId: mongoDbIdSchema.optional(),
  }),
);

// Type exports
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CartInput = z.infer<typeof cartSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
