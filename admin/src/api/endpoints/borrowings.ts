import apiClient from "../apiConfig";
import type { Borrow, BorrowFilterParams } from "@/types/borrow";
import type { PaginatedResponse, ApiResponse } from "@/types/common";

// Re-export action functions for backward compatibility
export {
  createBorrowing,
  approveBorrowing,
  rejectBorrowing,
  returnBorrowing,
  cancelBorrowing,
  extendBorrowing,
} from "./borrowingActions";

/**
 * Get all borrowings with pagination, search, and filters
 * GET /borrows
 */
export async function getAllBorrowings(params?: BorrowFilterParams) {
  const response = await apiClient.get<PaginatedResponse<Borrow>>("/borrows", {
    params,
  });
  return response.data;
}

/**
 * Get a single borrowing by ID
 * GET /borrows/:id
 */
export async function getBorrowingById(id: string) {
  const response = await apiClient.get<ApiResponse<Borrow>>(`/borrows/${id}`);
  return response.data;
}

/**
 * Get overdue borrowings
 */
export async function getOverdueBorrowings(params?: BorrowFilterParams) {
  const response = await apiClient.get<PaginatedResponse<Borrow>>(
    "/borrows/overdue",
    { params },
  );
  return response.data;
}
