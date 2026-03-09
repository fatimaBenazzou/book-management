/**
 * Query Parameter Types for API Requests
 */

/**
 * Base pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Sort parameters
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Search parameters
 */
export interface SearchParams {
  search?: string;
}

/**
 * Combined filter parameters
 */
export interface BaseFilterParams
  extends PaginationParams,
    SortParams,
    SearchParams {
  category?: string;
}

/**
 * Book-specific filter parameters
 */
export interface BookFilterParams extends BaseFilterParams {
  author?: string;
  status?: "in-shelf" | "out-of-stock";
  minPrice?: number;
  maxPrice?: number;
  availability?: "inStock" | "outOfStock";
}

/**
 * Author filter parameters
 */
export type AuthorFilterParams = BaseFilterParams;

/**
 * Category filter parameters
 */
export type CategoryFilterParams = BaseFilterParams;

/**
 * User filter parameters
 */
export interface UserFilterParams extends BaseFilterParams {
  role?: "Admin" | "User";
  isActive?: boolean;
}

/**
 * Borrow filter parameters
 */
export interface BorrowFilterParams extends BaseFilterParams {
  status?:
    | "pending"
    | "approved"
    | "rejected"
    | "active"
    | "returned"
    | "overdue"
    | "cancelled";
  userId?: string;
  bookId?: string;
  overdue?: boolean;
}

/**
 * Order filter parameters
 */
export interface OrderFilterParams extends BaseFilterParams {
  status?:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "completed";
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  deliveryMethod?: "pickup" | "delivery";
  userId?: string;
}
