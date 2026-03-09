import { z } from "zod";

export const deliveryMethodSchema = z.enum(["pickup", "delivery"]);
export const paymentMethodSchema = z.enum(["cash_on_delivery"]);
export const paymentStatusSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
]);
export const orderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "completed",
]);

export type DeliveryMethod = z.infer<typeof deliveryMethodSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
