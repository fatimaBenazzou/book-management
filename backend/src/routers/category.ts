import { Router } from "express";
import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../handlers/categories.js";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  validateBodySchema,
  validateParamsSchema,
} from "../middlewares/validations.js";
import { idParamsSchema } from "../validation/utils.js";
import { categorySchema } from "../validation/categories.js";

const router = Router();

// =====================
// Public routes
// =====================

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get("/", getCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get("/:id", validateParamsSchema(idParamsSchema), getCategoryById);

// =====================
// Admin routes
// =====================

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private/Admin
 */
router.post(
  "/",
  CheckAuth,
  isAdmin,
  validateBodySchema(categorySchema),
  createCategory,
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private/Admin
 */
router.put(
  "/:id",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  validateBodySchema(categorySchema),
  updateCategory,
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private/Admin
 */
router.delete(
  "/:id",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  deleteCategory,
);

export default router;
