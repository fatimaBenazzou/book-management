import { Router } from "express";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  toggleFavorite,
  getProfile,
  updateProfile,
  changePassword,
} from "../handlers/users.js";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  validateBodySchema,
  validateParamsSchema,
} from "../middlewares/validations.js";
import { idParamsSchema } from "../validation/utils.js";
import {
  profileUpdateSchema,
  changePasswordSchema,
} from "../validation/users.js";

const router = Router();

// =====================
// Public routes (none)
// =====================

// =====================
// Protected routes
// =====================

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", CheckAuth, getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  "/profile",
  CheckAuth,
  validateBodySchema(profileUpdateSchema),
  updateProfile
);

/**
 * @route   PUT /api/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  "/change-password",
  CheckAuth,
  validateBodySchema(changePasswordSchema),
  changePassword
);

/**
 * @route   GET /api/users/favorites
 * @desc    Get user's favorite books
 * @access  Private
 */
router.get("/favorites", CheckAuth, getFavorites);

/**
 * @route   POST /api/users/favorites
 * @desc    Add book to favorites
 * @access  Private
 */
router.post("/favorites", CheckAuth, addToFavorites);

/**
 * @route   POST /api/users/favorites/toggle
 * @desc    Toggle book favorite status
 * @access  Private
 */
router.post("/favorites/toggle", CheckAuth, toggleFavorite);

/**
 * @route   DELETE /api/users/favorites/:bookId
 * @desc    Remove book from favorites
 * @access  Private
 */
router.delete("/favorites/:bookId", CheckAuth, removeFromFavorites);

// =====================
// Admin routes
// =====================

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin)
 * @access  Private/Admin
 */
router.get("/", CheckAuth, isAdmin, getUsers);

/**
 * @route   POST /api/users
 * @desc    Create new user (Admin)
 * @access  Private/Admin
 */
router.post("/", CheckAuth, isAdmin, createUser);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (Admin)
 * @access  Private/Admin
 */
router.get(
  "/:id",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user (Admin)
 * @access  Private/Admin
 */
router.put(
  "/:id",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin)
 * @access  Private/Admin
 */
router.delete(
  "/:id",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  deleteUser
);

export default router;
