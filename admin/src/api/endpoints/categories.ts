import apiClient from "../apiConfig";
import type { Category, CategoryFormInput } from "@/types/category";
import type {
  FilterParams,
  PaginatedResponse,
  ApiResponse,
} from "@/types/common";

/**
 * Get all categories with pagination, search, and filters
 * All operations are handled server-side
 */
export async function getAllCategories(params?: FilterParams) {
  const response = await apiClient.get<PaginatedResponse<Category>>(
    "/categories",
    { params },
  );
  return response.data;
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string) {
  const response = await apiClient.get<ApiResponse<Category>>(
    `/categories/${id}`,
  );
  return response.data;
}

/**
 * Create a new category
 */
export async function createCategory(data: CategoryFormInput) {
  const response = await apiClient.post<ApiResponse<Category>>(
    "/categories",
    data,
  );
  return response.data;
}

/**
 * Update an existing category
 */
export async function updateCategory(
  id: string,
  data: Partial<CategoryFormInput>,
) {
  const response = await apiClient.put<ApiResponse<Category>>(
    `/categories/${id}`,
    data,
  );
  return response.data;
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string) {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/categories/${id}`,
  );
  return response.data;
}
