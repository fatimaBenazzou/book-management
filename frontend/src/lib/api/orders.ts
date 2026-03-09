/**
 * Orders API — real backend calls via apiClient
 */

import { apiClient, buildQueryParams } from "./client";

/**
 * Fetch all orders with pagination (admin)
 */
export async function getOrders(
  params: PaginationParams = {},
): Promise<ApiPaginatedResponse<OrderI>> {
  const query = buildQueryParams({
    page: params.page,
    limit: params.limit,
    sortBy: params.sort,
    sortOrder: params.order,
    status: params.status,
    userId: params.userId,
  });
  const { data } = await apiClient.get<ApiPaginatedResponse<OrderI>>(
    `/orders${query}`,
  );
  return data;
}

/**
 * Fetch user's own orders
 */
export async function getMyOrders(
  params: PaginationParams = {},
): Promise<ApiPaginatedResponse<OrderI>> {
  const query = buildQueryParams({
    page: params.page,
    limit: params.limit,
    status: params.status,
  });
  const { data } = await apiClient.get<ApiPaginatedResponse<OrderI>>(
    `/orders/my${query}`,
  );
  return data;
}

/**
 * Fetch a single order by ID
 */
export async function getOrderById(id: string): Promise<OrderI> {
  const { data } = await apiClient.get<ApiSuccessResponse<OrderI>>(
    `/orders/${id}`,
  );
  return data.data;
}

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderData): Promise<OrderI> {
  const { data } = await apiClient.post<ApiSuccessResponse<OrderI>>(
    "/orders",
    orderData,
  );
  return data.data;
}

/**
 * Cancel an order
 */
export async function cancelOrder(
  id: string,
  reason?: string,
): Promise<{ success: true; message: string }> {
  const { data } = await apiClient.post<{ success: true; message: string }>(
    `/orders/${id}/cancel`,
    reason ? { reason } : undefined,
  );
  return data;
}

/**
 * Process payment for an order
 */
export async function payOrder(id: string): Promise<OrderI> {
  const { data } = await apiClient.post<ApiSuccessResponse<OrderI>>(
    `/orders/${id}/pay`,
  );
  return data.data;
}
