import { z } from "zod";

/**
 * Shipping address schema
 */
export const shippingAddressSchema = z.object({
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
 * Order form validation schema
 */
export const orderSchema = z
  .object({
    deliveryMethod: z.enum(["pickup", "delivery"]),
    shippingAddress: shippingAddressSchema.optional(),
    orderNotes: z
      .string()
      .max(500, "Order notes must be less than 500 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // If delivery method is "delivery", shipping address is required
      if (data.deliveryMethod === "delivery") {
        return data.shippingAddress !== undefined;
      }
      return true;
    },
    {
      message: "Shipping address is required for delivery orders",
      path: ["shippingAddress"],
    },
  );

/**
 * Order status update schema (admin)
 */
export const orderUpdateSchema = z.object({
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "completed",
  ]),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  trackingNumber: z.string().optional(),
  cancellationReason: z.string().optional(),
});

/**
 * Types inferred from schemas
 */
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderUpdateFormData = z.infer<typeof orderUpdateSchema>;
