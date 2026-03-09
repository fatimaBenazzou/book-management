import type { Types } from "mongoose";

/**
 * Base interface for all MongoDB documents
 * Contains common fields shared across all models
 */
export interface BaseDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User role enum - defines available roles in the system
 */
export type UserRole = "admin" | "user";

/**
 * Book status enum - indicates availability
 */
export type BookStatus = "in-shelf" | "out-of-stock";

/**
 * Borrow status enum - tracks borrow lifecycle
 */
export type BorrowStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "returned"
  | "overdue"
  | "cancelled";

/**
 * Order status enum - tracks order lifecycle
 */
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "completed";

/**
 * Payment status enum
 */
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

/**
 * Delivery method enum
 */
export type DeliveryMethod = "pickup" | "delivery";

/**
 * Payment method enum
 */
export type PaymentMethod = "cash_on_delivery";
