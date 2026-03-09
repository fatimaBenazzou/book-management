"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites, toggleFavoriteApi } from "@/lib/api";
import { useAppSelector } from "@/lib/store";

const favoriteKeys = {
  all: ["favorites"] as const,
  list: () => [...favoriteKeys.all, "list"] as const,
  ids: () => [...favoriteKeys.all, "ids"] as const,
};

/**
 * Hook to get the list of favorite book IDs.
 * Only fetches when the user is logged in.
 */
export function useFavoriteIds() {
  const { isLoggedIn } = useAppSelector((state) => state.user);

  return useQuery({
    queryKey: favoriteKeys.ids(),
    queryFn: async () => {
      const books = await getFavorites();
      return books.map((b) => b._id);
    },
    enabled: isLoggedIn,
    staleTime: 60_000,
  });
}

/**
 * Hook to get the full list of favorite books.
 */
export function useFavoriteBooks() {
  const { isLoggedIn } = useAppSelector((state) => state.user);

  return useQuery({
    queryKey: ["books", "favorites"],
    queryFn: getFavorites,
    enabled: isLoggedIn,
  });
}

/**
 * Check if a specific book is in favorites.
 */
export function useIsFavorite(bookId: string): boolean {
  const { data: ids } = useFavoriteIds();
  return ids?.includes(bookId) ?? false;
}

/**
 * Toggle favorite with optimistic update.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => toggleFavoriteApi(bookId),
    onMutate: async (bookId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: favoriteKeys.ids() });

      // Snapshot previous value
      const previousIds = queryClient.getQueryData<string[]>(
        favoriteKeys.ids(),
      );

      // Optimistically update
      queryClient.setQueryData<string[]>(favoriteKeys.ids(), (old = []) => {
        if (old.includes(bookId)) {
          return old.filter((id) => id !== bookId);
        }
        return [...old, bookId];
      });

      return { previousIds };
    },
    onError: (_err, _bookId, context) => {
      // Roll back on error
      if (context?.previousIds) {
        queryClient.setQueryData(favoriteKeys.ids(), context.previousIds);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: favoriteKeys.ids() });
      queryClient.invalidateQueries({ queryKey: ["books", "favorites"] });
    },
  });
}
