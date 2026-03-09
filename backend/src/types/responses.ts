/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string | string[] | Record<string, unknown>;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface ApiPaginatedResponse<T = unknown> {
  success: true;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}
