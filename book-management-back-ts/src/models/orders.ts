import { Schema, model, type Model } from "mongoose";
import type { IOrder } from "../types/models/order.js";

/**
 * Order schema definition
 * Defines the structure of order documents in MongoDB
 */
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    books: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: "books",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryMethod: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
      default: "pickup",
    },
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
      instructions: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery"],
      required: true,
      default: "cash_on_delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },
    orderNotes: {
      type: String,
      maxlength: 500,
    },
    trackingNumber: String,
    cancellationReason: String,
    cancelledAt: Date,
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: "users" },
        note: { type: String, maxlength: 500 },
      },
    ],
  },
  {
    toJSON: {
      versionKey: false,
    },
    toObject: {
      versionKey: false,
    },
    timestamps: true,
  },
);

const orderModel: Model<IOrder> = model<IOrder>("orders", orderSchema);

export default orderModel;
