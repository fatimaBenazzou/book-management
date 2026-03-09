"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuthors, getAuthorById } from "@/lib/api";

/**
 * Query key factory for authors
 */
export const authorKeys = {
  all: ["authors"] as const,
  lists: () => [...authorKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...authorKeys.lists(), params] as const,
  details: () => [...authorKeys.all, "detail"] as const,
  detail: (id: string) => [...authorKeys.details(), id] as const,
};

/**
 * Hook to fetch all authors with pagination
 * @param params - Pagination and filter parameters
 */
export function useAuthors(params: PaginationParams = {}) {
  return useQuery({
    queryKey: authorKeys.list(params),
    queryFn: () => getAuthors(params),
  });
}

/**
 * Hook to fetch a single author by ID
 * @param id - Author ID
 */
export function useAuthor(id: string) {
  return useQuery({
    queryKey: authorKeys.detail(id),
    queryFn: () => getAuthorById(id),
    enabled: Boolean(id),
  });
}
