import type { ParsedSearchParams } from "./searchParamsTypes";

/**
 * Check if any filters are active (excluding pagination)
 */
export function hasActiveFilters(params: ParsedSearchParams): boolean {
  return Boolean(
    params.search ||
      params.category ||
      params.author ||
      params.status ||
      params.minPrice !== undefined ||
      params.maxPrice !== undefined,
  );
}

/**
 * Get count of active filters
 */
export function getActiveFiltersCount(params: ParsedSearchParams): number {
  let count = 0;

  if (params.search) count++;
  if (params.category) count++;
  if (params.author) count++;
  if (params.status) count++;
  if (params.minPrice !== undefined) count++;
  if (params.maxPrice !== undefined) count++;

  return count;
}
