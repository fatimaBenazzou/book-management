import { Router } from "express";
import {
  getDashboardStats,
  getRecentActivity,
  getRevenueChart,
  getTopBooks,
  getUserStats,
  bulkUpdateUserStatus,
  getCategoryStats,
  getInventoryAlerts,
  exportData,
} from "../handlers/admin.js";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(CheckAuth, isAdmin);

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Private/Admin
 */
router.get("/dashboard", getDashboardStats);

/**
 * @route   GET /api/admin/activity
 * @desc    Get recent activity
 * @access  Private/Admin
 */
router.get("/activity", getRecentActivity);

/**
 * @route   GET /api/admin/revenue
 * @desc    Get revenue chart data
 * @access  Private/Admin
 */
router.get("/revenue", getRevenueChart);

/**
 * @route   GET /api/admin/top-books
 * @desc    Get top books by sales, ratings, or borrows
 * @access  Private/Admin
 */
router.get("/top-books", getTopBooks);

/**
 * @route   GET /api/admin/user-stats
 * @desc    Get user statistics
 * @access  Private/Admin
 */
router.get("/user-stats", getUserStats);

/**
 * @route   GET /api/admin/category-stats
 * @desc    Get category statistics
 * @access  Private/Admin
 */
router.get("/category-stats", getCategoryStats);

/**
 * @route   GET /api/admin/inventory-alerts
 * @desc    Get inventory alerts (low stock, out of stock)
 * @access  Private/Admin
 */
router.get("/inventory-alerts", getInventoryAlerts);

/**
 * @route   POST /api/admin/users/bulk-status
 * @desc    Bulk update user status
 * @access  Private/Admin
 */
router.post("/users/bulk-status", bulkUpdateUserStatus);

/**
 * @route   GET /api/admin/export/:type
 * @desc    Export data (users, books, orders, borrows)
 * @access  Private/Admin
 */
router.get("/export/:type", exportData);

export default router;
