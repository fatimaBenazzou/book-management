/**
 * Categories API — real backend calls via apiClient
 */

import { apiClient } from "./client";

/**
 * Fetch all categories (no pagination on backend)
 */
export async function getCategories(): Promise<
  ApiSuccessResponse<CategoryI[]>
> {
  const { data } =
    await apiClient.get<ApiSuccessResponse<CategoryI[]>>("/categories");
  return data;
}

/**
 * Fetch a single category by ID
 */
export async function getCategoryById(id: string): Promise<CategoryI> {
  const { data } = await apiClient.get<ApiSuccessResponse<CategoryI>>(
    `/categories/${id}`,
  );
  return data.data;
}

/**
 * Create a new category (admin)
 */
export async function createCategory(
  categoryData: CreateCategoryData,
): Promise<CategoryI> {
  const { data } = await apiClient.post<ApiSuccessResponse<CategoryI>>(
    "/categories",
    categoryData,
  );
  return data.data;
}

/**
 * Update an existing category (admin)
 */
export async function updateCategory(
  id: string,
  categoryData: UpdateCategoryData,
): Promise<CategoryI> {
  const { data } = await apiClient.put<ApiSuccessResponse<CategoryI>>(
    `/categories/${id}`,
    categoryData,
  );
  return data.data;
}

/**
 * Delete a category (admin)
 */
export async function deleteCategory(
  id: string,
): Promise<{ success: true; message: string }> {
  const { data } = await apiClient.delete<{ success: true; message: string }>(
    `/categories/${id}`,
  );
  return data;
}
