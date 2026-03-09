/**
 * User role types
 */
declare type UserRole = "admin" | "user";

/**
 * Book status types - indicates availability
 */
declare type BookStatus = "in-shelf" | "out-of-stock";

/**
 * Borrow status types - tracks borrow lifecycle
 */
declare type BorrowStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "returned"
  | "overdue"
  | "cancelled";

/**
 * Order status types - tracks order lifecycle
 */
declare type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "completed";

/**
 * Payment status types
 */
declare type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

/**
 * Delivery method types
 */
declare type DeliveryMethod = "pickup" | "delivery";

/**
 * Payment method types
 */
declare type PaymentMethod = "cash_on_delivery";
