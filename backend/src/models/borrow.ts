import { Schema, model, type Model } from "mongoose";
import type { IBorrowWithVirtuals } from "../types/models/borrow.js";

/**
 * Borrow schema definition
 * Defines the structure of borrow documents in MongoDB
 */
const borrowSchema = new Schema<IBorrowWithVirtuals>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "books",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "active",
        "returned",
        "overdue",
        "cancelled",
      ],
      default: "pending",
    },
    comments: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    approvedAt: {
      type: Date,
    },
    returnedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
    toObject: {
      versionKey: false,
      virtuals: true,
    },
    timestamps: true,
  },
);

/**
 * Virtual to calculate late fee dynamically
 */
borrowSchema.virtual("lateFee").get(function (
  this: IBorrowWithVirtuals,
): number {
  if (
    this.status !== "active" &&
    this.status !== "approved" &&
    this.status !== "overdue" &&
    this.status !== "returned"
  ) {
    return 0;
  }

  const dueDate = new Date(this.dueDate);
  const compareDate = this.returnedAt ? new Date(this.returnedAt) : new Date();

  if (compareDate <= dueDate) {
    return 0;
  }

  const daysOverdue = Math.ceil(
    (compareDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Type assertion needed because book might be populated or not
  const book = this.book as unknown as { lateFeePerDay?: number };
  return daysOverdue * (book?.lateFeePerDay || 1);
});

/**
 * Virtual for days overdue
 */
borrowSchema.virtual("daysOverdue").get(function (
  this: IBorrowWithVirtuals,
): number {
  const dueDate = new Date(this.dueDate);
  const compareDate = this.returnedAt ? new Date(this.returnedAt) : new Date();

  if (compareDate <= dueDate) {
    return 0;
  }

  return Math.ceil(
    (compareDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
  );
});

// Index for efficient queries
borrowSchema.index({ user: 1, status: 1 });
borrowSchema.index({ book: 1, status: 1 });
borrowSchema.index({ status: 1, dueDate: 1 });

// Ensure a user cannot borrow the same book twice concurrently
borrowSchema.index(
  { user: 1, book: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "active" } },
);

const borrowModel: Model<IBorrowWithVirtuals> = model<IBorrowWithVirtuals>(
  "borrows",
  borrowSchema,
);

export default borrowModel;
