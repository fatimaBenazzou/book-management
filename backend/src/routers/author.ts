import { Router } from "express";
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../handlers/author.js";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  validateBodySchema,
  validateParamsSchema,
  validateQuerySchema,
} from "../middlewares/validations.js";
import { idParamsSchema } from "../validation/utils.js";
import {
  authorSchema,
  authorUpdateSchema,
  authorQuerySchema,
} from "../validation/author.js";

const router = Router();

// =====================
// Public routes
// =====================

/**
 * @route   GET /api/authors
 * @desc    Get all authors with pagination
 * @access  Public
 */
router.get("/", validateQuerySchema(authorQuerySchema), getAuthors);

/**
 * @route   GET /api/authors/:id
 * @desc    Get author by ID with their books
 * @access  Public
 */
router.get("/:id", validateParamsSchema(idParamsSchema), getAuthorById);

// =====================
// Admin routes
// =====================

/**
 * @route   POST /api/authors
 * @desc    Create new author
 * @access  Private/Admin
 */
router.post(
  "/",
  CheckAuth,
  isAdmin,
  validateBodySchema(authorSchema),
  createAuthor,
);

/**
 * @route   PUT /api/authors/:id
 * @desc    Update author
 * @access  Private/Admin
 */
router.put(
  "/:id",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  validateBodySchema(authorUpdateSchema),
  updateAuthor,
);

/**
 * @route   DELETE /api/authors/:id
 * @desc    Delete author
 * @access  Private/Admin
 */
router.delete(
  "/:id",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  deleteAuthor,
);

export default router;
