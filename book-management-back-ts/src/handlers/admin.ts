import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userModel from "../models/users.js";
import bookModel from "../models/books.js";
import orderModel from "../models/orders.js";
import borrowModel from "../models/borrow.js";
import categoryModel from "../models/category.js";
import authorModel from "../models/author.js";
import rateModel from "../models/rate.js";
import { logger } from "../utils/logger.js";

/**
 * Dashboard statistics response
 */
interface DashboardStats {
  users: {
    total: number;
    admins: number;
    active: number;
    newThisMonth: number;
  };
  books: {
    total: number;
    active: number;
    outOfStock: number;
    categories: number;
    authors: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    revenue: number;
    revenueThisMonth: number;
  };
  borrows: {
    total: number;
    pending: number;
    active: number;
    overdue: number;
    returned: number;
  };
  ratings: {
    total: number;
    average: number;
  };
}

/**
 * Get dashboard statistics (Admin)
 */
export async function getDashboardStats(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      // Users stats
      totalUsers,
      adminUsers,
      activeUsers,
      newUsersThisMonth,
      // Books stats
      totalBooks,
      activeBooks,
      outOfStockBooks,
      totalCategories,
      totalAuthors,
      // Orders stats
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      revenueAgg,
      revenueThisMonthAgg,
      // Borrows stats
      totalBorrows,
      pendingBorrows,
      activeBorrows,
      overdueBorrows,
      returnedBorrows,
      // Ratings stats
      totalRatings,
      avgRatingAgg,
    ] = await Promise.all([
      // Users
      userModel.countDocuments(),
      userModel.countDocuments({ role: "admin" }),
      userModel.countDocuments({ isActive: true }),
      userModel.countDocuments({ createdAt: { $gte: startOfMonth } }),
      // Books
      bookModel.countDocuments(),
      bookModel.countDocuments({ status: "in-shelf" }),
      bookModel.countDocuments({ availableStock: 0 }),
      categoryModel.countDocuments(),
      authorModel.countDocuments(),
      // Orders
      orderModel.countDocuments(),
      orderModel.countDocuments({ status: "pending" }),
      orderModel.countDocuments({
        status: { $in: ["delivered", "completed"] },
      }),
      orderModel.countDocuments({ status: "cancelled" }),
      orderModel.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      orderModel.aggregate([
        {
          $match: { paymentStatus: "paid", createdAt: { $gte: startOfMonth } },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      // Borrows
      borrowModel.countDocuments(),
      borrowModel.countDocuments({ status: "pending" }),
      borrowModel.countDocuments({ status: "approved" }),
      borrowModel.countDocuments({
        status: "approved",
        dueDate: { $lt: now },
      }),
      borrowModel.countDocuments({ status: "returned" }),
      // Ratings
      rateModel.countDocuments(),
      rateModel.aggregate([
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
    ]);

    const stats: DashboardStats = {
      users: {
        total: totalUsers,
        admins: adminUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
      },
      books: {
        total: totalBooks,
        active: activeBooks,
        outOfStock: outOfStockBooks,
        categories: totalCategories,
        authors: totalAuthors,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        revenue: revenueAgg[0]?.total || 0,
        revenueThisMonth: revenueThisMonthAgg[0]?.total || 0,
      },
      borrows: {
        total: totalBorrows,
        pending: pendingBorrows,
        active: activeBorrows,
        overdue: overdueBorrows,
        returned: returnedBorrows,
      },
      ratings: {
        total: totalRatings,
        average: avgRatingAgg[0]?.avg
          ? Math.round(avgRatingAgg[0].avg * 10) / 10
          : 0,
      },
    };

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    logger.error("Error fetching dashboard stats:", { error });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get recent activity (Admin)
 */
export async function getRecentActivity(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const [recentOrders, recentBorrows, recentUsers, recentRatings] =
      await Promise.all([
        orderModel
          .find()
          .populate("user", "firstName lastName email")
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean(),
        borrowModel
          .find()
          .populate("user", "firstName lastName email")
          .populate("book", "title")
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean(),
        userModel
          .find()
          .select("firstName lastName email role createdAt")
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean(),
        rateModel
          .find()
          .populate("user", "firstName lastName")
          .populate("book", "title")
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean(),
      ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Recent activity fetched successfully",
      data: {
        orders: recentOrders,
        borrows: recentBorrows,
        users: recentUsers,
        ratings: recentRatings,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch recent activity",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get revenue chart data (Admin)
 */
export async function getRevenueChart(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const period = (req.query.period as string) || "month";

    let dateFormat: string;
    let startDate: Date;

    const now = new Date();

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFormat = "%Y-%m-%d";
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        dateFormat = "%Y-%m";
        break;
      case "month":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFormat = "%Y-%m-%d";
        break;
    }

    const revenueData = await orderModel.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          revenue: 1,
          orders: "$count",
          _id: 0,
        },
      },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Revenue chart data fetched",
      data: revenueData,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch revenue chart data",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get top books (Admin)
 */
export async function getTopBooks(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const metric = (req.query.metric as string) || "sales";

    let topBooks;

    if (metric === "ratings") {
      topBooks = await bookModel
        .find({ ratingCount: { $gt: 0 } })
        .populate("author", "name")
        .populate("category", "name")
        .sort({ avgRating: -1, ratingCount: -1 })
        .limit(limit);
    } else if (metric === "borrows") {
      topBooks = await borrowModel.aggregate([
        { $group: { _id: "$book", borrowCount: { $sum: 1 } } },
        { $sort: { borrowCount: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "book",
          },
        },
        { $unwind: "$book" },
        {
          $lookup: {
            from: "authors",
            localField: "book.author",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: "$book._id",
            title: "$book.title",
            cover: "$book.cover",
            author: "$author.name",
            borrowCount: 1,
          },
        },
      ]);
    } else {
      // Default: sales
      topBooks = await orderModel.aggregate([
        { $unwind: "$books" },
        {
          $group: {
            _id: "$books.book",
            salesCount: { $sum: "$books.quantity" },
            revenue: { $sum: "$books.price" },
          },
        },
        { $sort: { salesCount: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "book",
          },
        },
        { $unwind: "$book" },
        {
          $lookup: {
            from: "authors",
            localField: "book.author",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: "$book._id",
            title: "$book.title",
            cover: "$book.cover",
            author: "$author.name",
            salesCount: 1,
            revenue: 1,
          },
        },
      ]);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Top books fetched",
      data: topBooks,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch top books",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get user statistics by role (Admin)
 */
export async function getUserStats(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const usersByRole = await userModel.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const usersByMonth = await userModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User statistics fetched",
      data: {
        byRole: usersByRole,
        byMonth: usersByMonth,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Bulk update user status (Admin)
 */
// export async function bulkUpdateUserStatus(
//   req: Request,
//   res: Response,
// ): Promise<void> {
//   try {
//     const { userIds, isActive } = req.body as {
//       userIds: string[];
//       isActive: boolean;
//     };

//     if (!userIds || userIds.length === 0) {
//       res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "User IDs are required",
//       });
//       return;
//     }

//     const result = await userModel.updateMany(
//       { _id: { $in: userIds } },
//       { $set: { isActive } },
//     );

//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: `${result.modifiedCount} users updated`,
//       data: { modifiedCount: result.modifiedCount },
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to update users",
//       error: error instanceof Error ? error.message : String(error),
//     });
//   }
// }

/**
 * Get category statistics (Admin)
 */
export async function getCategoryStats(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const categoryStats = await bookModel.aggregate([
      { $group: { _id: "$category", bookCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: "$category.name",
          bookCount: 1,
        },
      },
      { $sort: { bookCount: -1 } },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Category statistics fetched",
      data: categoryStats,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch category statistics",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get inventory alerts (Admin)
 */
export async function getInventoryAlerts(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const threshold = parseInt(req.query.threshold as string) || 5;

    const lowStockBooks = await bookModel
      .find({
        status: "in-shelf",
        availableStock: { $lte: threshold, $gt: 0 },
      })
      .populate("author", "name")
      .populate("category", "name")
      .sort({ availableStock: 1 });

    const outOfStockBooks = await bookModel
      .find({
        status: "out-of-stock",
      })
      .populate("author", "name")
      .populate("category", "name");

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Inventory alerts fetched",
      data: {
        lowStock: lowStockBooks,
        outOfStock: outOfStockBooks,
        lowStockCount: lowStockBooks.length,
        outOfStockCount: outOfStockBooks.length,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch inventory alerts",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Export data (Admin) - simple JSON export
 */
export async function exportData(req: Request, res: Response): Promise<void> {
  try {
    const { type } = req.params as { type: string };

    let data: unknown;
    let filename: string;

    switch (type) {
      case "users":
        data = await userModel.find().select("-password").lean();
        filename = "users-export.json";
        break;
      case "books":
        data = await bookModel
          .find()
          .populate("author", "name")
          .populate("category", "name")
          .lean();
        filename = "books-export.json";
        break;
      case "orders":
        data = await orderModel
          .find()
          .populate("user", "firstName lastName email")
          .populate("books.book", "title")
          .lean();
        filename = "orders-export.json";
        break;
      case "borrows":
        data = await borrowModel
          .find()
          .populate("user", "firstName lastName email")
          .populate("book", "title")
          .lean();
        filename = "borrows-export.json";
        break;
      default:
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message:
            "Invalid export type. Valid types: users, books, orders, borrows",
        });
        return;
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.status(StatusCodes.OK).send(JSON.stringify(data, null, 2));
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to export data",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
