// Order types

import type { ObjectId, FilterParams } from "./common";
import type { Book } from "./book";
import type { User } from "./user";

export type DeliveryMethod = "pickup" | "delivery";
export type PaymentMethod = "cash_on_delivery";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "completed";

export interface OrderBook {
  bookId: ObjectId | Book;
  title: string;
  quantity: number;
  price: number;
}

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

export interface StatusHistoryEntry {
  status: string;
  changedAt: string;
  changedBy?: ObjectId | User;
}

export interface Order {
  _id: ObjectId;
  id?: string;
  userId: ObjectId | User;
  books: OrderBook[];
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
  deliveryMethod: DeliveryMethod;
  shippingAddress?: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  orderNotes?: string;
  trackingNumber?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderPopulated extends Omit<Order, "userId" | "books"> {
  userId: User;
  books: Array<Omit<OrderBook, "bookId"> & { bookId: Book }>;
}

export interface OrderFilterParams extends FilterParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  deliveryMethod?: DeliveryMethod;
  userId?: string;
}

export interface OrderStatusUpdateInput {
  status: OrderStatus;
  note?: string;
}
