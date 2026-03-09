import type { Types } from "mongoose";
import type { BaseDocument } from "../common.js";

/**
 * Rating document interface
 * Represents a user's rating for a book
 */
export interface IRating extends BaseDocument {
  /** Reference to the user who rated */
  ratedBy: Types.ObjectId;
  /** Reference to the book being rated */
  bookId: Types.ObjectId;
  /** Rating value (1-5) */
  rating: number;
}
