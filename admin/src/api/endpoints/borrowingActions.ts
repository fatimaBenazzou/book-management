import apiClient from "../apiConfig";
import type { Borrow, BorrowFormInput } from "@/types/borrow";
import type { ApiResponse } from "@/types/common";

/**
 * Request to borrow a book
 * POST /borrows/request
 */
export async function createBorrowing(data: BorrowFormInput) {
  const response = await apiClient.post<ApiResponse<Borrow>>(
    "/borrows/request",
    data,
  );
  return response.data;
}

/**
 * Approve a borrow request (Admin)
 * POST /borrows/:id/approve
 */
export async function approveBorrowing(id: string) {
  const response = await apiClient.post<ApiResponse<Borrow>>(
    `/borrows/${id}/approve`,
  );
  return response.data;
}

/**
 * Reject a borrow request (Admin)
 * POST /borrows/:id/reject
 */
export async function rejectBorrowing(id: string, reason?: string) {
  const response = await apiClient.post<ApiResponse<Borrow>>(
    `/borrows/${id}/reject`,
    { reason },
  );
  return response.data;
}

/**
 * Return a borrowed book
 * POST /borrows/:id/return
 */
export async function returnBorrowing(id: string) {
  const response = await apiClient.post<ApiResponse<Borrow>>(
    `/borrows/${id}/return`,
  );
  return response.data;
}

/**
 * Cancel a borrow request
 * POST /borrows/:id/cancel
 */
export async function cancelBorrowing(id: string) {
  const response = await apiClient.post<ApiResponse<Borrow>>(
    `/borrows/${id}/cancel`,
  );
  return response.data;
}

/**
 * Extend borrow period
 * POST /borrows/:id/extend
 */
export async function extendBorrowing(id: string, additionalDays: number = 7) {
  const response = await apiClient.post<ApiResponse<Borrow>>(
    `/borrows/${id}/extend`,
    { additionalDays },
  );
  return response.data;
}
