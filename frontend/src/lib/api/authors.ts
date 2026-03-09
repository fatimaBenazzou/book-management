/**
 * Authors API — real backend calls via apiClient
 */

import { apiClient, buildQueryParams } from "./client";

/**
 * Fetch all authors with optional pagination and filtering
 */
export async function getAuthors(
  params: PaginationParams = {},
): Promise<ApiPaginatedResponse<AuthorI>> {
  const query = buildQueryParams({
    page: params.page,
    limit: params.limit,
    search: params.search,
    sortBy: params.sort,
    sortOrder: params.order,
  });
  const { data } = await apiClient.get<ApiPaginatedResponse<AuthorI>>(
    `/authors${query}`,
  );
  return data;
}

/**
 * Fetch a single author by ID
 */
export async function getAuthorById(id: string): Promise<AuthorI> {
  const { data } = await apiClient.get<ApiSuccessResponse<AuthorI>>(
    `/authors/${id}`,
  );
  return data.data;
}

/**
 * Create a new author (admin)
 */
export async function createAuthor(
  authorData: CreateAuthorData,
): Promise<AuthorI> {
  const { data } = await apiClient.post<ApiSuccessResponse<AuthorI>>(
    "/authors",
    authorData,
  );
  return data.data;
}

/**
 * Update an existing author (admin)
 */
export async function updateAuthor(
  id: string,
  authorData: UpdateAuthorData,
): Promise<AuthorI> {
  const { data } = await apiClient.put<ApiSuccessResponse<AuthorI>>(
    `/authors/${id}`,
    authorData,
  );
  return data.data;
}

/**
 * Delete an author (admin)
 */
export async function deleteAuthor(
  id: string,
): Promise<{ success: true; message: string }> {
  const { data } = await apiClient.delete<{ success: true; message: string }>(
    `/authors/${id}`,
  );
  return data;
}
