import type { Types, Document } from "mongoose";
import type {
  OrderStatus,
  PaymentStatus,
  DeliveryMethod,
  PaymentMethod,
} from "../common.js";

/**
 * Shipping address for delivery orders
 */
export interface ShippingAddress {
  fullName?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
  instructions?: string;
}

/**
 * Book item in an order
 */
export interface OrderBookItem {
  /** Reference to the book */
  bookId: Types.ObjectId;
  /** Book title (stored for historical reference) */
  title: string;
  /** Quantity ordered */
  quantity: number;
  /** Price at time of order */
  price: number;
}

/**
 * Order status history entry
 */
export interface StatusHistoryEntry {
  status: string;
  changedAt: Date;
  changedBy?: Types.ObjectId;
  note?: string;
}

/**
 * Order document interface
 * Represents a book purchase order
 */
export interface IOrder {
  /** Reference to the user who placed the order */
  userId: Types.ObjectId;
  /** Books in the order */
  books: OrderBookItem[];
  /** Order subtotal (before shipping) */
  subtotal: number;
  /** Shipping fee */
  shippingFee: number;
  /** Total price (subtotal + shipping) */
  totalPrice: number;
  /** How the order will be delivered */
  deliveryMethod: DeliveryMethod;
  /** Shipping address (required for delivery) */
  shippingAddress?: ShippingAddress;
  /** Payment method */
  paymentMethod: PaymentMethod;
  /** Payment status */
  paymentStatus: PaymentStatus;
  /** Order status */
  status: OrderStatus;
  /** Additional notes from customer (optional) */
  orderNotes?: string;
  /** Tracking number for shipment (optional) */
  trackingNumber?: string;
  /** Reason for cancellation (optional) */
  cancellationReason?: string;
  /** Date when cancelled (optional) */
  cancelledAt?: Date;
  /** Status change history */
  statusHistory: StatusHistoryEntry[];
}

/**
 * Order document type (mongoose document)
 */
export type IOrderDocument = Document<Types.ObjectId> & IOrder;
