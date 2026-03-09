import apiClient from "../apiConfig";
import type {
  Order,
  OrderFilterParams,
  OrderStatusUpdateInput,
} from "@/types/order";
import type { PaginatedResponse, ApiResponse } from "@/types/common";

/**
 * Get all orders with pagination, search, and filters
 * GET /orders → paginated response
 */
export async function getAllOrders(params?: OrderFilterParams) {
  const response = await apiClient.get<PaginatedResponse<Order>>("/orders", {
    params,
  });
  return response.data;
}

/**
 * Get a single order by ID
 * GET /orders/:id
 */
export async function getOrderById(id: string) {
  const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data;
}

/**
 * Update order status (Admin)
 * PUT /orders/:id/status → { status, note? }
 */
export async function updateOrderStatus(
  id: string,
  data: OrderStatusUpdateInput,
) {
  const response = await apiClient.put<ApiResponse<Order>>(
    `/orders/${id}/status`,
    data,
  );
  return response.data;
}

/**
 * Cancel an order
 * POST /orders/:id/cancel → { reason? }
 */
export async function cancelOrder(id: string, reason?: string) {
  const response = await apiClient.post<ApiResponse<Order>>(
    `/orders/${id}/cancel`,
    { reason },
  );
  return response.data;
}
