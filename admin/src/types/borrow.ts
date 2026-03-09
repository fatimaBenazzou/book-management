// Borrow types

import type { ObjectId, FilterParams } from "./common";
import type { User } from "./user";
import type { Book, BookPopulated } from "./book";

export type BorrowStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "returned"
  | "overdue"
  | "cancelled";

export interface Borrow {
  _id: ObjectId;
  id: string;
  user: ObjectId | User;
  book: ObjectId | Book;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: BorrowStatus;
  comments?: string;
  approvedBy?: ObjectId | User;
  approvedAt?: string;
  returnedAt?: string;
  rejectionReason?: string;
  lateFee?: number;
  daysOverdue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowPopulated extends Omit<
  Borrow,
  "user" | "book" | "approvedBy"
> {
  user: User;
  book: BookPopulated;
  approvedBy?: User;
}

export interface BorrowFilterParams extends FilterParams {
  status?: BorrowStatus;
  user?: string;
  book?: string;
}

export interface BorrowFormInput {
  bookId: string;
  dueDate: string;
  comments?: string;
}

export interface ProcessBorrowInput {
  action: "approve" | "reject";
  reason?: string;
}
