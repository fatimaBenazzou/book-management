/**
 * Basic borrow data for creating/updating
 */
declare interface BasicBorrowI {
  user: string;
  book: string | BookI;
  borrowDate?: string;
  dueDate: string;
  returnDate?: string;
  status?: BorrowStatus;
  comments?: string;
  approvedBy?: string;
  approvedAt?: string;
  returnedAt?: string;
  rejectionReason?: string;
}

/**
 * Full borrow interface with all fields
 */
declare interface BorrowI extends BasicBorrowI {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Borrow with populated user and book
 */
declare interface BorrowPopulatedI extends Omit<BorrowI, "user" | "book"> {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  book: {
    _id: string;
    title: string;
    cover?: string;
    serialNumber: string;
    rentalPrice: number;
    lateFeePerDay: number;
  };
  lateFee?: number;
  daysOverdue?: number;
}

/**
 * Late fee calculation result
 */
declare interface LateFeeCalculation {
  borrowId: string;
  book: BookI;
  dueDate: string;
  daysOverdue: number;
  lateFeePerDay: number;
  totalLateFee: number;
  rentalPrice: number;
  totalCost: number;
}

/**
 * Data required to create a new borrow request
 */
declare interface CreateBorrowData {
  bookId: string;
  dueDate: string;
  comments?: string;
}

/**
 * Data for updating a borrow
 */
declare interface UpdateBorrowData {
  status?: BorrowStatus;
  rejectionReason?: string;
  returnDate?: string;
}
