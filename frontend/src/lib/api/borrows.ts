/**
 * Borrows API — real backend calls via apiClient
 */

import { apiClient, buildQueryParams } from "./client";

/**
 * Fetch all borrows with pagination (admin)
 */
export async function getBorrows(
  params: PaginationParams = {},
): Promise<ApiPaginatedResponse<BorrowI>> {
  const query = buildQueryParams({
    page: params.page,
    limit: params.limit,
    sortBy: params.sort,
    sortOrder: params.order,
    status: params.status,
    user: params.user,
    book: params.book,
  });
  const { data } = await apiClient.get<ApiPaginatedResponse<BorrowI>>(
    `/borrows${query}`,
  );
  return data;
}

/**
 * Fetch user's own borrows
 */
export async function getMyBorrows(
  params: PaginationParams = {},
): Promise<ApiPaginatedResponse<BorrowI>> {
  const query = buildQueryParams({
    page: params.page,
    limit: params.limit,
    status: params.status,
  });
  const { data } = await apiClient.get<ApiPaginatedResponse<BorrowI>>(
    `/borrows/my${query}`,
  );
  return data;
}

/**
 * Fetch a single borrow by ID
 */
export async function getBorrowById(id: string): Promise<BorrowI> {
  const { data } = await apiClient.get<ApiSuccessResponse<BorrowI>>(
    `/borrows/${id}`,
  );
  return data.data;
}

/**
 * Create a new borrow request
 */
export async function createBorrow(
  borrowData: CreateBorrowData,
): Promise<BorrowI> {
  const { data } = await apiClient.post<ApiSuccessResponse<BorrowI>>(
    "/borrows/request",
    borrowData,
  );
  return data.data;
}

/**
 * Return a borrowed book
 */
export async function returnBorrow(id: string): Promise<BorrowI> {
  const { data } = await apiClient.post<ApiSuccessResponse<BorrowI>>(
    `/borrows/${id}/return`,
  );
  return data.data;
}

/**
 * Cancel a borrow request
 */
export async function cancelBorrow(
  id: string,
): Promise<{ success: true; message: string }> {
  const { data } = await apiClient.post<{ success: true; message: string }>(
    `/borrows/${id}/cancel`,
  );
  return data;
}

/**
 * Extend a borrow period
 */
export async function extendBorrow(
  id: string,
  additionalDays?: number,
): Promise<{ newDueDate: string; additionalDays: number }> {
  const { data } = await apiClient.post<
    ApiSuccessResponse<{ newDueDate: string; additionalDays: number }>
  >(`/borrows/${id}/extend`, additionalDays ? { additionalDays } : undefined);
  return data.data;
}
