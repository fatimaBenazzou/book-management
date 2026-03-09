import apiClient from "../apiConfig";
import type { Book, BookFormInput, BookFilterParams } from "@/types/book";
import type { PaginatedResponse, ApiResponse } from "@/types/common";

/**
 * Get all books with pagination, search, and filters
 * All operations are handled server-side
 */
export async function getAllBooks(params?: BookFilterParams) {
  const response = await apiClient.get<PaginatedResponse<Book>>("/books", {
    params,
  });
  return response.data;
}

/**
 * Get a single book by ID
 */
export async function getBookById(id: string) {
  const response = await apiClient.get<ApiResponse<Book>>(`/books/${id}`);
  return response.data;
}

/**
 * Create a new book
 */
export async function createBook(data: BookFormInput) {
  const response = await apiClient.post<ApiResponse<Book>>("/books", data);
  return response.data;
}

/**
 * Update an existing book
 */
export async function updateBook(id: string, data: Partial<BookFormInput>) {
  const response = await apiClient.put<ApiResponse<Book>>(`/books/${id}`, data);
  return response.data;
}

/**
 * Delete a book
 */
export async function deleteBook(id: string) {
  const response = await apiClient.delete<ApiResponse<null>>(`/books/${id}`);
  return response.data;
}

/**
 * Get books by category
 */
export async function getBooksByCategory(
  categoryId: string,
  params?: BookFilterParams,
) {
  const response = await apiClient.get<PaginatedResponse<Book>>("/books", {
    params: { ...params, category: categoryId },
  });
  return response.data;
}

/**
 * Get books by author
 */
export async function getBooksByAuthor(
  authorId: string,
  params?: BookFilterParams,
) {
  const response = await apiClient.get<PaginatedResponse<Book>>("/books", {
    params: { ...params, author: authorId },
  });
  return response.data;
}

/**
 * Upload book cover image
 */
export async function uploadBookCover(bookId: string, file: File) {
  const formData = new FormData();
  formData.append("cover", file);

  const response = await apiClient.post<ApiResponse<{ url: string }>>(
    `/books/${bookId}/cover`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
}
