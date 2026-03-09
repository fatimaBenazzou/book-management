/**
 * Hooks barrel export
 */

// Query Provider
export { QueryProvider } from "./QueryProvider";

// Books hooks
export {
  useBooks,
  useBook,
  usePopularBooks,
  useNewArrivals,
  useBooksByCategory,
  useBooksByAuthor,
  useRecommendations,
  bookKeys,
} from "./useBooks";

// Book ratings hooks
export {
  useBookRatings,
  useAddBookRating,
  useDeleteBookRating,
} from "./useBookRatings";

// Authors hooks
export { useAuthors, useAuthor, authorKeys } from "./useAuthors";

// Categories hooks
export { useCategories, useCategory, categoryKeys } from "./useCategories";

// Borrows hooks
export {
  useBorrows,
  useMyBorrows,
  useBorrow,
  useCreateBorrow,
  useReturnBorrow,
  useCancelBorrow,
  useExtendBorrow,
  borrowKeys,
} from "./useBorrows";

// Orders hooks
export {
  useMyOrders,
  useOrder,
  useCreateOrder,
  useCancelOrder,
  usePayOrder,
  orderKeys,
} from "./useOrders";

// Auth hooks
export {
  useProfile,
  useLogin,
  useRegister,
  useLogout,
  useUpdateProfile,
  useChangePassword,
  authKeys,
} from "./useAuth";

// User hook (state management)
export { default as useUser } from "./useUser";

// Favorites hooks
export {
  useFavoriteIds,
  useFavoriteBooks,
  useIsFavorite,
  useToggleFavorite,
} from "./useFavorites";
