"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getBooks,
  getBookById,
  getPopularBooks,
  getNewArrivals,
  getBooksByCategory,
  getBooksByAuthor,
  getRecommendations,
} from "@/lib/api";

/** Query key factory for books */
export const bookKeys = {
  all: ["books"] as const,
  lists: () => [...bookKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...bookKeys.lists(), params] as const,
  popular: () => [...bookKeys.all, "popular"] as const,
  newArrivals: () => [...bookKeys.all, "new-arrivals"] as const,
  byCategory: (categoryId: string) =>
    [...bookKeys.all, "category", categoryId] as const,
  byAuthor: (authorId: string) =>
    [...bookKeys.all, "author", authorId] as const,
  recommendations: () => [...bookKeys.all, "recommendations"] as const,
  details: () => [...bookKeys.all, "detail"] as const,
  detail: (id: string) => [...bookKeys.details(), id] as const,
  ratings: (id: string) => [...bookKeys.detail(id), "ratings"] as const,
};

export function useBooks(params: PaginationParams = {}) {
  return useQuery({
    queryKey: bookKeys.list(params),
    queryFn: () => getBooks(params),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => getBookById(id),
    enabled: Boolean(id),
  });
}

export function usePopularBooks() {
  return useQuery({
    queryKey: bookKeys.popular(),
    queryFn: () => getPopularBooks(),
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: bookKeys.newArrivals(),
    queryFn: () => getNewArrivals(),
  });
}

export function useBooksByCategory(categoryId: string) {
  return useQuery({
    queryKey: bookKeys.byCategory(categoryId),
    queryFn: () => getBooksByCategory(categoryId),
    enabled: Boolean(categoryId),
  });
}

export function useBooksByAuthor(authorId: string) {
  return useQuery({
    queryKey: bookKeys.byAuthor(authorId),
    queryFn: () => getBooksByAuthor(authorId),
    enabled: Boolean(authorId),
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: bookKeys.recommendations(),
    queryFn: () => getRecommendations(),
  });
}
