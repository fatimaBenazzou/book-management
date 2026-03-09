import apiClient from "../apiConfig";
import type { Author, AuthorFormInput } from "@/types/author";
import type {
  FilterParams,
  PaginatedResponse,
  ApiResponse,
} from "@/types/common";

/**
 * Get all authors with pagination, search, and filters
 * All operations are handled server-side
 */
export async function getAllAuthors(params?: FilterParams) {
  const response = await apiClient.get<PaginatedResponse<Author>>("/authors", {
    params,
  });
  return response.data;
}

/**
 * Get a single author by ID
 */
export async function getAuthorById(id: string) {
  const response = await apiClient.get<ApiResponse<Author>>(`/authors/${id}`);
  return response.data;
}

/**
 * Create a new author
 */
export async function createAuthor(data: AuthorFormInput) {
  const response = await apiClient.post<ApiResponse<Author>>("/authors", data);
  return response.data;
}

/**
 * Update an existing author
 */
export async function updateAuthor(id: string, data: Partial<AuthorFormInput>) {
  const response = await apiClient.put<ApiResponse<Author>>(
    `/authors/${id}`,
    data,
  );
  return response.data;
}

/**
 * Delete an author
 */
export async function deleteAuthor(id: string) {
  const response = await apiClient.delete<ApiResponse<null>>(`/authors/${id}`);
  return response.data;
}

/**
 * Get author with their books
 */
export async function getAuthorWithBooks(id: string) {
  const response = await apiClient.get<ApiResponse<Author>>(
    `/authors/${id}?populate=books`,
  );
  return response.data;
}
