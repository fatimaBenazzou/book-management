/**
 * Book item in an order
 */
declare interface OrderBookItem {
  bookId: string | BookI;
  title: string;
  quantity: number;
  price: number;
}

/**
 * Shipping address for delivery orders
 */
declare interface ShippingAddress {
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
 * Basic order data for creating/updating
 */
declare interface BasicOrderI {
  userId: string;
  books: OrderBookItem[];
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
}

/**
 * Full order interface with all fields
 */
/**
 * Order status history entry
 */
declare interface StatusHistoryEntry {
  status: string;
  changedAt: string;
  changedBy?: string;
  note?: string;
}

/**
 * Full order interface with all fields
 */
declare interface OrderI extends BasicOrderI {
  _id: string;
  statusHistory?: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Order with populated user and books
 */
declare interface OrderPopulatedI extends Omit<OrderI, "userId" | "books"> {
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  books: Array<
    OrderBookItem & {
      bookId: {
        _id: string;
        title: string;
        cover?: string;
      };
    }
  >;
}

/**
 * Data required to create a new order
 */
declare interface CreateOrderData {
  books: Array<{ bookId: string; quantity: number }>;
  deliveryMethod: DeliveryMethod;
  shippingAddress?: ShippingAddress;
  orderNotes?: string;
}

/**
 * Data for updating an order
 */
declare interface UpdateOrderData {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  cancellationReason?: string;
}
