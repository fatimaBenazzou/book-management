"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBorrows,
  getMyBorrows,
  getBorrowById,
  createBorrow,
  returnBorrow,
  cancelBorrow,
  extendBorrow,
} from "@/lib/api";

/**
 * Query key factory for borrows
 */
export const borrowKeys = {
  all: ["borrows"] as const,
  lists: () => [...borrowKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...borrowKeys.lists(), params] as const,
  myLists: () => [...borrowKeys.all, "my-list"] as const,
  myList: (params: PaginationParams) =>
    [...borrowKeys.myLists(), params] as const,
  details: () => [...borrowKeys.all, "detail"] as const,
  detail: (id: string) => [...borrowKeys.details(), id] as const,
};

/**
 * Hook to fetch all borrows with pagination (admin)
 */
export function useBorrows(params: PaginationParams = {}) {
  return useQuery({
    queryKey: borrowKeys.list(params),
    queryFn: () => getBorrows(params),
  });
}

/**
 * Hook to fetch user's own borrows
 */
export function useMyBorrows(params: PaginationParams = {}) {
  return useQuery({
    queryKey: borrowKeys.myList(params),
    queryFn: () => getMyBorrows(params),
  });
}

/**
 * Hook to fetch a single borrow by ID
 */
export function useBorrow(id: string) {
  return useQuery({
    queryKey: borrowKeys.detail(id),
    queryFn: () => getBorrowById(id),
    enabled: Boolean(id),
  });
}

/**
 * Hook to create a new borrow request
 */
export function useCreateBorrow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBorrowData) => createBorrow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: borrowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: borrowKeys.myLists() });
    },
  });
}

/**
 * Hook to return a borrowed book
 */
export function useReturnBorrow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => returnBorrow(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: borrowKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: borrowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: borrowKeys.myLists() });
    },
  });
}

/**
 * Hook to cancel a borrow request
 */
export function useCancelBorrow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelBorrow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: borrowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: borrowKeys.myLists() });
    },
  });
}

/**
 * Hook to extend a borrow period
 */
export function useExtendBorrow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      additionalDays,
    }: {
      id: string;
      additionalDays?: number;
    }) => extendBorrow(id, additionalDays),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: borrowKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: borrowKeys.myLists() });
    },
  });
}
