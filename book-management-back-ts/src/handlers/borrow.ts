import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import borrowModel from "../models/borrow.js";
import bookModel from "../models/books.js";
import userModel from "../models/users.js";
import type {
  AuthenticatedRequest,
  RequestWithParsedQuery,
} from "../types/express.js";
import { logger } from "../utils/logger.js";
import { addDays } from "../utils/dateHelpers.js";
import type { BorrowStatus } from "../types/common.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseFormatter.js";

/**
 * Borrow filter query interface — mirrors borrowQuerySchema output
 */
interface BorrowFilterQuery {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: 1 | -1;
  status?: BorrowStatus;
  user?: string;
  book?: string;
}

/**
 * Get all borrow records (Admin)
 */
export async function getBorrows(req: Request, res: Response): Promise<void> {
  try {
    const parsedReq = req as RequestWithParsedQuery<BorrowFilterQuery>;
    const {
      limit = 10,
      page = 1,
      sortBy = "createdAt",
      sortOrder = -1,
      status,
    } = parsedReq.parsedQuery;

    // sortBy is already validated by borrowQuerySchema (only allowed field names)
    const { user, book } = parsedReq.parsedQuery;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (user) filter.user = user;
    if (book) filter.book = book;

    const [borrows, total] = await Promise.all([
      borrowModel
        .find(filter)
        .populate("user", "firstName lastName email avatar")
        .populate("book", "title cover price")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ [sortBy]: sortOrder })
        .lean(),
      borrowModel.countDocuments(filter),
    ]);

    paginatedResponse(
      res,
      borrows,
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      "Borrow records fetched successfully",
    );
  } catch (error) {
    logger.error("Error fetching borrows:", { error });
    errorResponse(res, error, "Failed to fetch borrow records");
  }
}

/**
 * Get user's borrow history
 */
export async function getUserBorrows(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;
    const {
      status,
      limit = "10",
      page = "1",
    } = req.query as { status?: BorrowStatus; limit?: string; page?: string };

    const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);

    const filter: Record<string, unknown> = { user: userId };
    if (status) filter.status = status;

    const [borrows, total] = await Promise.all([
      borrowModel
        .find(filter)
        .populate("book", "title cover author price")
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .skip((pageNum - 1) * limitNum),
      borrowModel.countDocuments(filter),
    ]);

    paginatedResponse(
      res,
      borrows,
      {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      "Borrow history fetched successfully",
    );
  } catch (error) {
    logger.error("Error fetching user borrows:", { error });
    errorResponse(res, error, "Failed to fetch borrow history");
  }
}

/**
 * Request to borrow a book
 */
export async function requestBorrow(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;
    const { bookId, dueDate, comments } = req.body as {
      bookId: string;
      dueDate: Date;
      comments?: string;
    };

    // Check if book exists and has available stock
    const book = await bookModel.findById(bookId);
    if (!book) {
      errorResponse(res, null, "Book not found", StatusCodes.NOT_FOUND);
      return;
    }

    if (book.availableStock <= 0) {
      errorResponse(
        res,
        null,
        "Book is not available for borrowing",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    // Check if user already has this book borrowed
    const existingBorrow = await borrowModel.findOne({
      user: userId,
      book: bookId,
      status: { $in: ["pending", "approved", "active"] },
    });

    if (existingBorrow) {
      errorResponse(
        res,
        null,
        "You already have an active borrow for this book",
        StatusCodes.CONFLICT,
      );
      return;
    }

    // Check user's borrow limit (max 5 active borrows)
    const activeBorrowCount = await borrowModel.countDocuments({
      user: userId,
      status: { $in: ["pending", "approved", "active"] },
    });

    if (activeBorrowCount >= 5) {
      errorResponse(
        res,
        null,
        "You have reached your borrow limit (5 books)",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    // Create borrow request
    const borrow = await borrowModel.create({
      user: userId,
      book: bookId,
      borrowDate: new Date(),
      dueDate,
      status: "pending",
      ...(comments && { comments }),
    });

    const populatedBorrow = await borrow.populate([
      { path: "book", select: "title cover author" },
      { path: "user", select: "firstName lastName email" },
    ]);

    successResponse(
      res,
      populatedBorrow,
      "Borrow request submitted successfully",
      StatusCodes.CREATED,
    );
  } catch (error) {
    logger.error("Error requesting borrow:", { error });
    errorResponse(res, error, "Failed to submit borrow request");
  }
}

/**
 * Approve borrow request (Admin)
 */
export async function approveBorrow(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const adminId = authReq.user._id;

    const borrow = await borrowModel.findById(id);
    if (!borrow) {
      errorResponse(
        res,
        null,
        "Borrow request not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    if (borrow.status !== "pending") {
      errorResponse(
        res,
        null,
        "Only pending requests can be approved",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    // Atomically decrement stock only if still available (prevents race condition)
    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: borrow.book, availableStock: { $gt: 0 } },
      { $inc: { availableStock: -1 } },
      { new: true },
    );
    if (!updatedBook) {
      errorResponse(
        res,
        null,
        "Book is no longer available for borrowing",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    // Update borrow status to active
    borrow.status = "active";
    borrow.approvedAt = new Date();
    borrow.approvedBy = adminId;
    await borrow.save();

    // Add book to user's borrowed list
    await userModel.findByIdAndUpdate(borrow.user, {
      $addToSet: { "books.borrowed": borrow.book },
    });

    const populatedBorrow = await borrow.populate([
      { path: "book", select: "title cover author" },
      { path: "user", select: "firstName lastName email" },
    ]);

    successResponse(res, populatedBorrow, "Borrow request approved");
  } catch (error) {
    logger.error("Error approving borrow:", { error });
    errorResponse(res, error, "Failed to approve borrow request");
  }
}

/**
 * Reject borrow request (Admin)
 */
export async function rejectBorrow(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { reason } = req.body as { reason?: string };

    const borrow = await borrowModel.findById(id);
    if (!borrow) {
      errorResponse(
        res,
        null,
        "Borrow request not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    if (borrow.status !== "pending") {
      errorResponse(
        res,
        null,
        "Only pending requests can be rejected",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    borrow.status = "rejected";
    if (reason) {
      borrow.rejectionReason = reason;
    }
    await borrow.save();

    const populatedBorrow = await borrow.populate([
      { path: "book", select: "title cover" },
      { path: "user", select: "firstName lastName email" },
    ]);

    successResponse(res, populatedBorrow, "Borrow request rejected");
  } catch (error) {
    logger.error("Error rejecting borrow:", { error });
    errorResponse(res, error, "Failed to reject borrow request");
  }
}

/**
 * Return borrowed book
 */
export async function returnBook(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const userId = authReq.user._id;
    const isAdmin = (authReq.user as { role?: string }).role === "admin";

    const borrow = await borrowModel.findById(id);
    if (!borrow) {
      errorResponse(
        res,
        null,
        "Borrow record not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    // Check ownership (unless admin)
    if (!isAdmin && borrow.user.toString() !== userId.toString()) {
      errorResponse(
        res,
        null,
        "You can only return your own borrowed books",
        StatusCodes.FORBIDDEN,
      );
      return;
    }

    if (borrow.status !== "approved" && borrow.status !== "active") {
      errorResponse(
        res,
        null,
        "Only active borrows can be returned",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    // Capture raw IDs before populate() mutates the document references
    const rawBookId = borrow.book;
    const rawUserId = borrow.user;

    // Update borrow record
    const returnDate = new Date();
    borrow.status = "returned";
    borrow.returnDate = returnDate;
    borrow.returnedAt = returnDate;
    await borrow.save();

    // Populate book before reading lateFee virtual (needs lateFeePerDay from book)
    const populatedBorrow = await borrow.populate([
      { path: "book", select: "title cover lateFeePerDay" },
    ]);

    // Get late fee (virtual field — requires book to be populated)
    const lateFee = populatedBorrow.lateFee || 0;

    // Increase book's available stock
    await bookModel.findByIdAndUpdate(rawBookId, {
      $inc: { availableStock: 1 },
    });

    // Update user's books lists using raw ObjectIds for correct $pull/$addToSet matching
    await userModel.findByIdAndUpdate(rawUserId, {
      $pull: { "books.borrowed": rawBookId },
      $addToSet: { "books.read": rawBookId },
    });

    successResponse(
      res,
      { ...populatedBorrow.toObject(), lateFee, isOverdue: lateFee > 0 },
      "Book returned successfully",
    );
  } catch (error) {
    logger.error("Error returning book:", { error });
    errorResponse(res, error, "Failed to return book");
  }
}

/**
 * Cancel borrow request (by user)
 */
export async function cancelBorrow(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const userId = authReq.user._id;

    const borrow = await borrowModel.findById(id);
    if (!borrow) {
      errorResponse(
        res,
        null,
        "Borrow request not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    // Check ownership
    if (borrow.user.toString() !== userId.toString()) {
      errorResponse(
        res,
        null,
        "You can only cancel your own borrow requests",
        StatusCodes.FORBIDDEN,
      );
      return;
    }

    if (borrow.status !== "pending") {
      errorResponse(
        res,
        null,
        "Only pending requests can be cancelled",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    borrow.status = "cancelled";
    await borrow.save();

    successResponse(res, borrow, "Borrow request cancelled");
  } catch (error) {
    logger.error("Error cancelling borrow:", { error });
    errorResponse(res, error, "Failed to cancel borrow request");
  }
}

/**
 * Extend borrow period
 */
export async function extendBorrow(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const { additionalDays = 7 } = req.body as { additionalDays?: number };
    const MAX_EXTEND_DAYS = 30;
    const cappedDays = Math.min(Math.max(additionalDays, 1), MAX_EXTEND_DAYS);
    const userId = authReq.user._id;

    const borrow = await borrowModel.findById(id);
    if (!borrow) {
      errorResponse(
        res,
        null,
        "Borrow record not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    // Check ownership
    if (borrow.user.toString() !== userId.toString()) {
      errorResponse(
        res,
        null,
        "You can only extend your own borrows",
        StatusCodes.FORBIDDEN,
      );
      return;
    }

    if (borrow.status !== "approved" && borrow.status !== "active") {
      errorResponse(
        res,
        null,
        "Only active borrows can be extended",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    // Check if already overdue
    if (borrow.dueDate && new Date() > borrow.dueDate) {
      errorResponse(
        res,
        null,
        "Cannot extend overdue borrows. Please return the book first.",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    // Extend due date
    borrow.dueDate = addDays(borrow.dueDate!, cappedDays);
    await borrow.save();

    successResponse(
      res,
      { newDueDate: borrow.dueDate, additionalDays: cappedDays },
      "Borrow period extended",
    );
  } catch (error) {
    logger.error("Error extending borrow:", { error });
    errorResponse(res, error, "Failed to extend borrow period");
  }
}

/**
 * Get borrow by ID
 */
export async function getBorrowById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const userId = authReq.user._id;
    const isAdmin = (authReq.user as { role?: string }).role === "admin";

    const borrow = await borrowModel
      .findById(id)
      .populate("book", "title cover author price")
      .populate("user", "firstName lastName email avatar");

    if (!borrow) {
      errorResponse(
        res,
        null,
        "Borrow record not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    // Check ownership (unless admin)
    const borrowUserId = (borrow.user as { _id?: unknown })._id || borrow.user;
    if (!isAdmin && borrowUserId.toString() !== userId.toString()) {
      errorResponse(res, null, "Access denied", StatusCodes.FORBIDDEN);
      return;
    }

    successResponse(res, borrow, "Borrow record fetched successfully");
  } catch (error) {
    logger.error("Error fetching borrow by id:", { error });
    errorResponse(res, error, "Failed to fetch borrow record");
  }
}

/**
 * Get overdue borrows (Admin)
 */
export async function getOverdueBorrows(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const borrows = await borrowModel
      .find({
        // Include both "active" (normal flow) and "overdue" (explicitly marked) statuses
        status: { $in: ["active", "overdue"] },
        dueDate: { $lt: new Date() },
      })
      .populate("user", "firstName lastName email")
      .populate("book", "title cover")
      .sort({ dueDate: 1 });

    successResponse(res, borrows, "Overdue borrows fetched successfully");
  } catch (error) {
    logger.error("Error fetching overdue borrows:", { error });
    errorResponse(res, error, "Failed to fetch overdue borrows");
  }
}
