import { Router } from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookRatings,
  addBookRating,
  deleteBookRating,
  getRecommendations,
  getPopularBooks,
  getNewArrivals,
  searchBooks,
  getBooksByCategory,
  getBooksByAuthor,
} from "../handlers/books.js";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  validateBodySchema,
  validateParamsSchema,
  validateQuerySchema,
} from "../middlewares/validations.js";
import { idParamsSchema } from "../validation/utils.js";
import {
  bookSchema,
  bookUpdateSchema,
  bookQuerySchema,
  bookRatingParamsSchema,
} from "../validation/book.js";
import { ratingSchema } from "../validation/rate.js";

const router = Router();

// =====================
// Public routes
// =====================

/**
 * @route   GET /api/books
 * @desc    Get all books with pagination and filtering
 * @access  Public
 */
router.get("/", validateQuerySchema(bookQuerySchema), getBooks);

/**
 * @route   GET /api/books/search
 * @desc    Search books
 * @access  Public
 */
router.get("/search", searchBooks);

/**
 * @route   GET /api/books/popular
 * @desc    Get popular books
 * @access  Public
 */
router.get("/popular", getPopularBooks);

/**
 * @route   GET /api/books/new
 * @desc    Get new arrivals
 * @access  Public
 */
router.get("/new", getNewArrivals);

/**
 * @route   GET /api/books/category/:categoryId
 * @desc    Get books by category
 * @access  Public
 */
router.get("/category/:categoryId", getBooksByCategory);

/**
 * @route   GET /api/books/author/:authorId
 * @desc    Get books by author
 * @access  Public
 */
router.get("/author/:authorId", getBooksByAuthor);

/**
 * @route   GET /api/books/recommendations
 * @desc    Get personalized recommendations
 * @access  Private
 */
router.get("/recommendations", CheckAuth, getRecommendations);

/**
 * @route   GET /api/books/:id
 * @desc    Get single book
 * @access  Public
 */
router.get("/:id", validateParamsSchema(idParamsSchema), getBookById);

/**
 * @route   GET /api/books/:id/ratings
 * @desc    Get book ratings
 * @access  Public
 */
router.get(
  "/:id/ratings",
  validateParamsSchema(idParamsSchema),
  getBookRatings,
);

// =====================
// Protected routes
// =====================

/**
 * @route   POST /api/books/:id/ratings
 * @desc    Add rating to book
 * @access  Private
 */
router.post(
  "/:id/ratings",
  CheckAuth,
  validateParamsSchema(idParamsSchema),
  validateBodySchema(ratingSchema),
  addBookRating,
);

/**
 * @route   DELETE /api/books/:id/ratings/:ratingId
 * @desc    Delete rating from book
 * @access  Private
 */
router.delete(
  "/:id/ratings/:ratingId",
  CheckAuth,
  validateParamsSchema(bookRatingParamsSchema),
  deleteBookRating,
);

// =====================
// Admin routes
// =====================

/**
 * @route   POST /api/books
 * @desc    Create new book
 * @access  Private/Admin
 */
router.post(
  "/",
  CheckAuth,
  isAdmin,
  validateBodySchema(bookSchema),
  createBook,
);

/**
 * @route   PUT /api/books/:id
 * @desc    Update book
 * @access  Private/Admin
 */
router.put(
  "/:id",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  validateBodySchema(bookUpdateSchema),
  updateBook,
);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete book
 * @access  Private/Admin
 */
router.delete(
  "/:id",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  deleteBook,
);

export default router;
