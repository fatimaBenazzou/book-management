"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategoryById } from "@/lib/api";

/**
 * Query key factory for categories
 */
export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

/**
 * Hook to fetch all categories (no pagination on backend)
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => getCategories(),
  });
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id),
  });
}
