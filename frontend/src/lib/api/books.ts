/**
 * Books API — real backend calls via apiClient
 */

import { apiClient, buildQueryParams } from "./client";

/**
 * Fetch all books with optional pagination and filtering
 */
export async function getBooks(
  params: PaginationParams = {},
): Promise<ApiPaginatedResponse<BookI>> {
  const query = buildQueryParams({
    page: params.page,
    limit: params.limit,
    search: params.search,
    sortBy: params.sort,
    sortOrder: params.order,
    category: params.category,
    author: params.author,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    status: params.status,
    availability: params.availability,
  });
  const { data } = await apiClient.get<ApiPaginatedResponse<BookI>>(
    `/books${query}`,
  );
  return data;
}

/**
 * Fetch a single book by ID
 */
export async function getBookById(id: string): Promise<BookI> {
  const { data } = await apiClient.get<ApiSuccessResponse<BookI>>(
    `/books/${id}`,
  );
  return data.data;
}

/**
 * Create a new book (admin)
 */
export async function createBook(bookData: CreateBookData): Promise<BookI> {
  const { data } = await apiClient.post<ApiSuccessResponse<BookI>>(
    "/books",
    bookData,
  );
  return data.data;
}

/**
 * Update an existing book (admin)
 */
export async function updateBook(
  id: string,
  bookData: UpdateBookData,
): Promise<BookI> {
  const { data } = await apiClient.put<ApiSuccessResponse<BookI>>(
    `/books/${id}`,
    bookData,
  );
  return data.data;
}

/**
 * Delete a book (admin)
 */
export async function deleteBook(
  id: string,
): Promise<{ success: true; message: string }> {
  const { data } = await apiClient.delete<{ success: true; message: string }>(
    `/books/${id}`,
  );
  return data;
}

/**
 * Search books by query
 */
export async function searchBooks(
  query: string,
  params: PaginationParams = {},
): Promise<ApiPaginatedResponse<BookI>> {
  const qs = buildQueryParams({
    q: query,
    page: params.page,
    limit: params.limit,
  });
  const { data } = await apiClient.get<ApiPaginatedResponse<BookI>>(
    `/books/search${qs}`,
  );
  return data;
}

/**
 * Get popular books
 */
export async function getPopularBooks(limit = 10): Promise<BookI[]> {
  const qs = buildQueryParams({ limit });
  const { data } = await apiClient.get<ApiSuccessResponse<BookI[]>>(
    `/books/popular${qs}`,
  );
  return data.data;
}

/**
 * Get new arrivals
 */
export async function getNewArrivals(limit = 10): Promise<BookI[]> {
  const qs = buildQueryParams({ limit });
  const { data } = await apiClient.get<ApiSuccessResponse<BookI[]>>(
    `/books/new${qs}`,
  );
  return data.data;
}

/**
 * Get books by category
 */
export async function getBooksByCategory(
  categoryId: string,
  params: PaginationParams = {},
): Promise<ApiPaginatedResponse<BookI>> {
  const qs = buildQueryParams({ page: params.page, limit: params.limit });
  const { data } = await apiClient.get<ApiPaginatedResponse<BookI>>(
    `/books/category/${categoryId}${qs}`,
  );
  return data;
}

/**
 * Get books by author
 */
export async function getBooksByAuthor(
  authorId: string,
  params: PaginationParams = {},
): Promise<ApiPaginatedResponse<BookI>> {
  const qs = buildQueryParams({ page: params.page, limit: params.limit });
  const { data } = await apiClient.get<ApiPaginatedResponse<BookI>>(
    `/books/author/${authorId}${qs}`,
  );
  return data;
}

/**
 * Get personalized book recommendations (auth required)
 */
export async function getRecommendations(limit = 10): Promise<BookI[]> {
  const qs = buildQueryParams({ limit });
  const { data } = await apiClient.get<ApiSuccessResponse<BookI[]>>(
    `/books/recommendations${qs}`,
  );
  return data.data;
}

/**
 * Get ratings for a book
 */
export async function getBookRatings(
  bookId: string,
): Promise<RatePopulatedI[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<RatePopulatedI[]>>(
    `/books/${bookId}/ratings`,
  );
  return data.data;
}

/**
 * Add a rating to a book (auth required)
 */
export async function addBookRating(
  bookId: string,
  ratingData: CreateRateData,
): Promise<RateI> {
  const { data } = await apiClient.post<ApiSuccessResponse<RateI>>(
    `/books/${bookId}/ratings`,
    ratingData,
  );
  return data.data;
}

/**
 * Delete a rating (auth required)
 */
export async function deleteBookRating(
  bookId: string,
  ratingId: string,
): Promise<{ success: true; message: string }> {
  const { data } = await apiClient.delete<{ success: true; message: string }>(
    `/books/${bookId}/ratings/${ratingId}`,
  );
  return data;
}
