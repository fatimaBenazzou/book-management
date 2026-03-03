import { Schema, model, type Model } from "mongoose";
import type { IBook } from "../types/models/book.js";
import { BookStatus } from "../types/common.js";

/**
 * Book schema definition
 * Defines the structure of book documents in MongoDB
 */
const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "authors",
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      original: {
        type: Number,
      },
      current: {
        type: Number,
        required: true,
      },
    },
    rentalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lateFeePerDay: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["in-shelf", "out-of-stock"] as BookStatus[],
      default: "in-shelf",
    },
    description: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
    },
    keywords: [{ type: String }],
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
    },
    contributedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
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
 * Validation: availableStock must not exceed totalStock
 * Auto-calculate status based on availableStock
 */
bookSchema.pre("save", function (next) {
  if (this.availableStock > this.totalStock) {
    return next(new Error("Available stock cannot exceed total stock"));
  }

  // Auto-calculate status based on availableStock
  if (this.availableStock === 0) {
    this.status = "out-of-stock";
  } else {
    this.status = "in-shelf";
  }

  next();
});

/**
 * Update status when stock changes via findOneAndUpdate
 */
bookSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as {
    $set?: { availableStock?: number; status?: string };
  };
  if (update.$set && update.$set.availableStock !== undefined) {
    update.$set.status =
      update.$set.availableStock === 0 ? "out-of-stock" : "in-shelf";
  }
  next();
});

/**
 * Post-hook: sync status after $inc operations on availableStock
 * Handles borrow approve/return which use $inc instead of $set
 */
bookSchema.post("findOneAndUpdate", async function () {
  const update = this.getUpdate() as Record<string, unknown>;
  const inc = update?.$inc as Record<string, number> | undefined;

  // Only run for $inc on availableStock
  if (!inc || inc.availableStock === undefined) return;

  const docId = (this.getQuery() as { _id?: unknown })._id;
  if (!docId) return;

  const doc = (await this.model
    .findById(docId)
    .select("availableStock status")
    .lean()) as { availableStock: number; status: string } | null;
  if (!doc) return;

  const newStatus = doc.availableStock === 0 ? "out-of-stock" : "in-shelf";
  if (doc.status !== newStatus) {
    await this.model.updateOne({ _id: docId }, { $set: { status: newStatus } });
  }
});

// Text search index for title, description, keywords
bookSchema.index(
  { title: "text", description: "text", keywords: "text" },
  { name: "search_index" },
);

// Indexes for efficient queries
bookSchema.index({ author: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ createdAt: -1 });

/**
 * Cascading delete - remove related ratings when book is deleted
 */
bookSchema.pre("findOneAndDelete", async function (next) {
  const query = this.getQuery() as { _id?: unknown };
  const bookId = query._id;
  if (bookId) {
    const rateModel = (await import("./rate.js")).default;
    await rateModel.deleteMany({ bookId });
  }
  next();
});

bookSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const rateModel = (await import("./rate.js")).default;
    await rateModel.deleteMany({ bookId: this._id });
    next();
  },
);

const bookModel: Model<IBook> = model<IBook>("books", bookSchema);

export default bookModel;
