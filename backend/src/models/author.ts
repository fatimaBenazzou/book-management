import { Schema, model, type Model } from "mongoose";
import type { IAuthor } from "../types/models/author.js";

/**
 * Author schema definition
 * Defines the structure of author documents in MongoDB
 */
const authorSchema = new Schema<IAuthor>(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
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
 * Virtual populate for books
 * Allows fetching all books by this author
 */
authorSchema.virtual("books", {
  ref: "books",
  localField: "_id",
  foreignField: "author",
});

const authorModel: Model<IAuthor> = model<IAuthor>("authors", authorSchema);

export default authorModel;
