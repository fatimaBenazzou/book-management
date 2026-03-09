import { Router } from "express";
import {
  getBorrows,
  getUserBorrows,
  requestBorrow,
  approveBorrow,
  rejectBorrow,
  returnBook,
  cancelBorrow,
  extendBorrow,
  getBorrowById,
  getOverdueBorrows,
} from "../handlers/borrow.js";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  validateBodySchema,
  validateParamsSchema,
  validateQuerySchema,
} from "../middlewares/validations.js";
import { idParamsSchema } from "../validation/utils.js";
import {
  borrowSchema,
  extendBorrowSchema,
  rejectBorrowSchema,
  borrowQuerySchema,
} from "../validation/borrow.js";

const router = Router();

// =====================
// Protected routes (User)
// =====================

/**
 * @route   GET /api/borrows/my
 * @desc    Get current user's borrow history
 * @access  Private
 */
router.get("/my", CheckAuth, getUserBorrows);

/**
 * @route   POST /api/borrows/request
 * @desc    Request to borrow a book
 * @access  Private
 */
router.post(
  "/request",
  CheckAuth,
  validateBodySchema(borrowSchema),
  requestBorrow,
);

/**
 * @route   POST /api/borrows/:id/cancel
 * @desc    Cancel borrow request
 * @access  Private
 */
router.post(
  "/:id/cancel",
  CheckAuth,
  validateParamsSchema(idParamsSchema),
  cancelBorrow,
);

/**
 * @route   POST /api/borrows/:id/extend
 * @desc    Extend borrow period
 * @access  Private
 */
router.post(
  "/:id/extend",
  CheckAuth,
  validateParamsSchema(idParamsSchema),
  validateBodySchema(extendBorrowSchema),
  extendBorrow,
);

/**
 * @route   POST /api/borrows/:id/return
 * @desc    Return borrowed book
 * @access  Private
 */
router.post(
  "/:id/return",
  CheckAuth,
  validateParamsSchema(idParamsSchema),
  returnBook,
);

// =====================
// Admin routes
// =====================

/**
 * @route   GET /api/borrows
 * @desc    Get all borrow records (Admin)
 * @access  Private/Admin
 */
router.get(
  "/",
  CheckAuth,
  isAdmin,
  validateQuerySchema(borrowQuerySchema),
  getBorrows,
);

/**
 * @route   GET /api/borrows/overdue
 * @desc    Get all overdue borrows (Admin)
 * @access  Private/Admin
 * NOTE: Must be registered BEFORE /:id to avoid Express matching "overdue" as an id param
 */
router.get("/overdue", CheckAuth, isAdmin, getOverdueBorrows);

/**
 * @route   GET /api/borrows/:id
 * @desc    Get borrow by ID
 * @access  Private
 */
router.get(
  "/:id",
  CheckAuth,
  validateParamsSchema(idParamsSchema),
  getBorrowById,
);

/**
 * @route   POST /api/borrows/:id/approve
 * @desc    Approve borrow request (Admin)
 * @access  Private/Admin
 */
router.post(
  "/:id/approve",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  approveBorrow,
);

/**
 * @route   POST /api/borrows/:id/reject
 * @desc    Reject borrow request (Admin)
 * @access  Private/Admin
 */
router.post(
  "/:id/reject",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  validateBodySchema(rejectBorrowSchema),
  rejectBorrow,
);

export default router;
