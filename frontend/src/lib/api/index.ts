/**
 * API Services barrel export
 */

// Client and utilities
export { apiClient, ApiError, buildQueryParams } from "./client";

// Auth API
export {
  login,
  register,
  logout,
  getProfile,
  updateProfile,
  changePassword,
} from "./auth";

// Books API
export {
  getBooks,
  getBookById,
  searchBooks,
  getPopularBooks,
  getNewArrivals,
  getBooksByCategory,
  getBooksByAuthor,
  getRecommendations,
  getBookRatings,
  addBookRating,
  deleteBookRating,
} from "./books";

// Authors API
export { getAuthors, getAuthorById } from "./authors";

// Categories API
export { getCategories, getCategoryById } from "./categories";

// Borrows API
export {
  getBorrows,
  getMyBorrows,
  getBorrowById,
  createBorrow,
  returnBorrow,
  cancelBorrow,
  extendBorrow,
} from "./borrows";

// Orders API
export {
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  payOrder,
} from "./orders";

// Users API
export {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavoriteApi,
} from "./users";
