/**
 * Users API — real backend calls via apiClient
 */

import { apiClient } from "./client";

/**
 * Fetch all users (admin)
 */
export async function getUsers(): Promise<ApiSuccessResponse<UserI[]>> {
  const { data } = await apiClient.get<ApiSuccessResponse<UserI[]>>("/users");
  return data;
}

/**
 * Fetch a single user by ID (admin)
 */
export async function getUserById(id: string): Promise<UserI> {
  const { data } = await apiClient.get<ApiSuccessResponse<UserI>>(
    `/users/${id}`,
  );
  return data.data;
}

/**
 * Update a user (admin)
 */
export async function updateUser(
  id: string,
  userData: UpdateUserData,
): Promise<UserI> {
  const { data } = await apiClient.put<ApiSuccessResponse<UserI>>(
    `/users/${id}`,
    userData,
  );
  return data.data;
}

/**
 * Delete a user (admin)
 */
export async function deleteUser(
  id: string,
): Promise<{ success: true; message: string }> {
  const { data } = await apiClient.delete<{ success: true; message: string }>(
    `/users/${id}`,
  );
  return data;
}

/**
 * Get user's favorite books
 */
export async function getFavorites(): Promise<BookI[]> {
  const { data } =
    await apiClient.get<ApiSuccessResponse<BookI[]>>("/users/favorites");
  return data.data;
}

/**
 * Add a book to favorites
 */
export async function addToFavorites(bookId: string): Promise<string[]> {
  const { data } = await apiClient.post<ApiSuccessResponse<string[]>>(
    "/users/favorites",
    { bookId },
  );
  return data.data;
}

/**
 * Remove a book from favorites
 */
export async function removeFromFavorites(bookId: string): Promise<string[]> {
  const { data } = await apiClient.delete<ApiSuccessResponse<string[]>>(
    `/users/favorites/${bookId}`,
  );
  return data.data;
}

/**
 * Toggle a book in favorites
 */
export async function toggleFavoriteApi(
  bookId: string,
): Promise<{ favorites: string[]; isFavorite: boolean }> {
  const { data } = await apiClient.post<
    ApiSuccessResponse<{ favorites: string[]; isFavorite: boolean }>
  >("/users/favorites/toggle", { bookId });
  return data.data;
}
