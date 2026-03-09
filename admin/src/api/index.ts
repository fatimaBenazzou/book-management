// API Endpoints - Export all API modules
export * as authApi from "./endpoints/auth";
export * as booksApi from "./endpoints/books";
export * as authorsApi from "./endpoints/authors";
export * as categoriesApi from "./endpoints/categories";
export * as usersApi from "./endpoints/users";
export * as borrowingsApi from "./endpoints/borrowings";
export * as ordersApi from "./endpoints/orders";

// Export the configured axios instance for custom requests
export { default as apiClient } from "./apiConfig";
