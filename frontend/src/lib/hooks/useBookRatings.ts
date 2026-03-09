"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookRatings, addBookRating, deleteBookRating } from "@/lib/api";
import { bookKeys } from "./useBooks";

export function useBookRatings(bookId: string) {
  return useQuery({
    queryKey: bookKeys.ratings(bookId),
    queryFn: () => getBookRatings(bookId),
    enabled: Boolean(bookId),
  });
}

export function useAddBookRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookId,
      data,
    }: {
      bookId: string;
      data: { rating: number };
    }) => addBookRating(bookId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: bookKeys.ratings(variables.bookId),
      });
      queryClient.invalidateQueries({
        queryKey: bookKeys.detail(variables.bookId),
      });
    },
  });
}

export function useDeleteBookRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, ratingId }: { bookId: string; ratingId: string }) =>
      deleteBookRating(bookId, ratingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: bookKeys.ratings(variables.bookId),
      });
      queryClient.invalidateQueries({
        queryKey: bookKeys.detail(variables.bookId),
      });
    },
  });
}
