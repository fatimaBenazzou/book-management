/**
 * Server-side API helpers for fetching data in Server Components.
 * These use native fetch() (no axios) so they work in RSC context.
 */

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function buildQuery(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

async function serverFetch<T>(
  path: string,
  options?: { auth?: boolean },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.auth) {
    const token = await getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ─── Public book endpoints ────────────────────────────────────

export async function fetchPopularBooks(limit = 10): Promise<BookI[]> {
  const data = await serverFetch<ApiSuccessResponse<BookI[]>>(
    `/books/popular${buildQuery({ limit })}`,
  );
  return data.data;
}

export async function fetchNewArrivals(limit = 10): Promise<BookI[]> {
  const data = await serverFetch<ApiSuccessResponse<BookI[]>>(
    `/books/new${buildQuery({ limit })}`,
  );
  return data.data;
}

export async function fetchBooks(
  params: Record<string, unknown> = {},
): Promise<ApiPaginatedResponse<BookI>> {
  return serverFetch<ApiPaginatedResponse<BookI>>(
    `/books${buildQuery(params)}`,
  );
}

export async function fetchBookById(id: string): Promise<BookI> {
  const data = await serverFetch<ApiSuccessResponse<BookI>>(`/books/${id}`);
  return data.data;
}

export async function fetchBooksByAuthor(
  authorId: string,
  params: Record<string, unknown> = {},
): Promise<ApiPaginatedResponse<BookI>> {
  return serverFetch<ApiPaginatedResponse<BookI>>(
    `/books/author/${authorId}${buildQuery(params)}`,
  );
}

export async function fetchBooksByCategory(
  categoryId: string,
  params: Record<string, unknown> = {},
): Promise<ApiPaginatedResponse<BookI>> {
  return serverFetch<ApiPaginatedResponse<BookI>>(
    `/books/category/${categoryId}${buildQuery(params)}`,
  );
}

// ─── Auth-required book endpoints ─────────────────────────────

export async function fetchRecommendations(limit = 10): Promise<BookI[]> {
  try {
    const data = await serverFetch<ApiSuccessResponse<BookI[]>>(
      `/books/recommendations${buildQuery({ limit })}`,
      { auth: true },
    );
    return data.data;
  } catch {
    return [];
  }
}

// ─── Author endpoints ─────────────────────────────────────────

export async function fetchAuthorById(id: string): Promise<AuthorI | null> {
  try {
    const data = await serverFetch<ApiSuccessResponse<AuthorI>>(
      `/authors/${id}`,
    );
    return data.data;
  } catch {
    return null;
  }
}

export async function fetchAuthors(
  params: Record<string, unknown> = {},
): Promise<ApiPaginatedResponse<AuthorI>> {
  return serverFetch<ApiPaginatedResponse<AuthorI>>(
    `/authors${buildQuery(params)}`,
  );
}

// ─── Category endpoints ───────────────────────────────────────

export async function fetchCategories(): Promise<
  ApiPaginatedResponse<CategoryI>
> {
  return serverFetch<ApiPaginatedResponse<CategoryI>>("/categories");
}

export async function fetchCategoryById(id: string): Promise<CategoryI | null> {
  try {
    const data = await serverFetch<ApiSuccessResponse<CategoryI>>(
      `/categories/${id}`,
    );
    return data.data;
  } catch {
    return null;
  }
}

// ─── User profile (auth required) ────────────────────────────

export async function fetchUserProfile(): Promise<UserI | null> {
  try {
    const data = await serverFetch<ApiSuccessResponse<UserI>>(
      "/users/profile",
      { auth: true },
    );
    return data.data;
  } catch {
    return null;
  }
}
