import type { Types } from "mongoose";
import type { BorrowStatus } from "../common.js";

/**
 * Borrow document interface
 * Represents a book borrowing record
 */
export interface IBorrow {
  /** Reference to the user borrowing the book */
  user: Types.ObjectId;
  /** Reference to the book being borrowed */
  book: Types.ObjectId;
  /** Date when book was borrowed */
  borrowDate: Date;
  /** Expected return date */
  dueDate: Date;
  /** Actual return date (set when returned) */
  returnDate?: Date;
  /** Current status of the borrow */
  status: BorrowStatus;
  /** User comments for the borrow request (optional) */
  comments?: string;
  /** Admin who approved/rejected the request (optional) */
  approvedBy?: Types.ObjectId;
  /** Date when request was approved/rejected (optional) */
  approvedAt?: Date;
  /** Date when book was returned (optional) */
  returnedAt?: Date;
  /** Reason for rejection (optional) */
  rejectionReason?: string;
}

/**
 * Borrow document with virtual fields
 */
export interface IBorrowWithVirtuals extends IBorrow {
  /** Calculated late fee (virtual) */
  lateFee: number;
  /** Number of days overdue (virtual) */
  daysOverdue: number;
}
