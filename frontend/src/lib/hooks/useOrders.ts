"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  payOrder,
} from "@/lib/api";

/**
 * Query key factory for orders
 */
export const orderKeys = {
  all: ["orders"] as const,
  myLists: () => [...orderKeys.all, "my-list"] as const,
  myList: (params: PaginationParams) =>
    [...orderKeys.myLists(), params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

/**
 * Hook to fetch user's own orders
 */
export function useMyOrders(params: PaginationParams = {}) {
  return useQuery({
    queryKey: orderKeys.myList(params),
    queryFn: () => getMyOrders(params),
  });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
  });
}

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.myLists() });
    },
  });
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.myLists() });
    },
  });
}

/**
 * Hook to process payment for an order
 */
export function usePayOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => payOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.myLists() });
    },
  });
}
