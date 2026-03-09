import { z } from "zod";
import { mongoDbIdSchema } from "./common";
import {
  deliveryMethodSchema,
  paymentMethodSchema,
  paymentStatusSchema,
  orderStatusSchema,
} from "./orderEnums";

export {
  deliveryMethodSchema,
  paymentMethodSchema,
  paymentStatusSchema,
  orderStatusSchema,
} from "./orderEnums";

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
    deliveryMethod: deliveryMethodSchema,
    shippingAddress: shippingAddressSchema.optional(),
    paymentMethod: paymentMethodSchema.optional(),
    orderNotes: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
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
  deliveryMethod: deliveryMethodSchema,
  shippingAddress: shippingAddressSchema.optional(),
  paymentMethod: paymentMethodSchema,
  paymentStatus: paymentStatusSchema,
  status: orderStatusSchema,
  orderNotes: z.string().max(500).optional(),
  trackingNumber: z.string().optional(),
});

export const orderStatusUpdateSchema = z.object({
  status: orderStatusSchema,
  note: z.string().max(500).optional(),
});

// Form schema for admin order processing
export const processOrderFormSchema = z.object({
  status: orderStatusSchema,
  note: z.string().max(500).optional(),
});

// Type exports
export type { DeliveryMethod, PaymentMethod, PaymentStatus, OrderStatus } from "./orderEnums";
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CartInput = z.infer<typeof cartSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
export type ProcessOrderFormInput = z.infer<typeof processOrderFormSchema>;
