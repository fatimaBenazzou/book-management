import type { Types } from "mongoose";
import type { BookStatus } from "../common.js";

/**
 * Book price structure
 */
export interface BookPrice {
  /** Original price (before discount) */
  original?: number;
  /** Current selling price */
  current: number;
}

/**
 * Book document interface
 * Represents a book in the library system
 */
export interface IBook {
  /** Book title */
  title: string;
  /** Reference to the author document */
  author: Types.ObjectId;
  /** Unique serial number (format: BK-XXXXX) */
  serialNumber: string;
  /** Book pricing information */
  price: BookPrice;
  /** Price for borrowing the book */
  rentalPrice: number;
  /** Daily late fee for overdue returns */
  lateFeePerDay: number;
  /** Total copies in the library */
  totalStock: number;
  /** Currently available copies */
  availableStock: number;
  /** Book availability status */
  status: BookStatus;
  /** Book description */
  description: string;
  /** Cover image URL (optional) */
  cover?: string;
  /** Search keywords (optional) */
  keywords?: string[];
  /** Reference to category document (optional) */
  category?: Types.ObjectId;
  /** User who contributed this book (optional) */
  contributedBy?: Types.ObjectId;
}
