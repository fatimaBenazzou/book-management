import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import bookModel from "../models/books.js";
import rateModel from "../models/rate.js";
import borrowModel from "../models/borrow.js";
import userModel from "../models/users.js";
import type {
  AuthenticatedRequest,
  RequestWithParsedQuery,
} from "../types/express.js";
import { logger } from "../utils/logger.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseFormatter.js";

/**
 * Book query interface — mirrors bookQuerySchema output
 */
interface BookQuery {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: 1 | -1;
  search?: string;
  category?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  availability?: string;
}

/**
 * Get all books with pagination, filtering and sorting
 */
export async function getBooks(req: Request, res: Response): Promise<void> {
  try {
    const parsedReq = req as RequestWithParsedQuery<BookQuery>;
    const {
      limit = 10,
      page = 1,
      sortBy = "createdAt",
      sortOrder = -1,
      search,
      category,
      author,
      minPrice,
      maxPrice,
      status,
      availability,
    } = parsedReq.parsedQuery;

    // Build filter
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = new Types.ObjectId(category);
    }

    if (author) {
      filter.author = new Types.ObjectId(author);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter["price.current"] = {};
      if (minPrice !== undefined) {
        (filter["price.current"] as Record<string, number>).$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        (filter["price.current"] as Record<string, number>).$lte = maxPrice;
      }
    }

    if (status) {
      filter.status = status;
    }

    if (availability) {
      switch (availability) {
        case "inStock":
          filter.availableStock = { $gt: 0 };
          break;
        case "outOfStock":
          filter.availableStock = 0;
          break;
      }
    }

    const [books, total] = await Promise.all([
      bookModel
        .find(filter)
        .populate("author", "name")
        .populate("category", "name")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ [sortBy]: sortOrder })
        .lean(),
      bookModel.countDocuments(filter),
    ]);

    paginatedResponse(
      res,
      books,
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      "Books fetched successfully",
    );
  } catch (error) {
    logger.error("Error fetching books:", { error });
    errorResponse(res, error, "Failed to fetch books");
  }
}

/**
 * Get single book by ID
 */
export async function getBookById(req: Request, res: Response): Promise<void> {
  try {
    const book = await bookModel
      .findById(req.params.id)
      .populate("author")
      .populate("category");

    if (!book) {
      errorResponse(res, null, "Book not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, book, "Book fetched successfully");
  } catch (error) {
    logger.error("Error fetching book:", { error });
    errorResponse(res, error, `Failed to fetch book ${req.params.id}`);
  }
}

/**
 * Create new book (Admin only)
 */
export async function createBook(req: Request, res: Response): Promise<void> {
  try {
    const book = await bookModel.create(req.body);
    const populatedBook = await book.populate(["author", "category"]);

    successResponse(
      res,
      populatedBook,
      "Book created successfully",
      StatusCodes.CREATED,
    );
  } catch (error) {
    logger.error("Error creating book:", { error });
    const err = error as Error & { code?: number };
    if (err.code === 11000) {
      errorResponse(res, err, "Book already exists", StatusCodes.CONFLICT);
    } else {
      errorResponse(res, err, "Failed to create book", StatusCodes.BAD_REQUEST);
    }
  }
}

/**
 * Update book (Admin only)
 */
export async function updateBook(req: Request, res: Response): Promise<void> {
  try {
    const book = await bookModel
      .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .populate("author")
      .populate("category");

    if (!book) {
      errorResponse(res, null, "Book not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, book, "Book updated successfully");
  } catch (error) {
    logger.error("Error updating book:", { error });
    errorResponse(res, error, `Failed to update book ${req.params.id}`);
  }
}

/**
 * Delete book (Admin only)
 */
export async function deleteBook(req: Request, res: Response): Promise<void> {
  try {
    // Check for active borrows before deleting
    const activeBorrows = await borrowModel.countDocuments({
      book: req.params.id,
      status: { $in: ["pending", "active", "overdue"] },
    });
    if (activeBorrows > 0) {
      errorResponse(
        res,
        null,
        `Cannot delete book with ${activeBorrows} active borrow(s)`,
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    const book = await bookModel.findByIdAndDelete(req.params.id);

    if (!book) {
      errorResponse(res, null, "Book not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, null, "Book deleted successfully");
  } catch (error) {
    logger.error("Error deleting book:", { error });
    errorResponse(res, error, `Failed to delete book ${req.params.id}`);
  }
}

/**
 * Get book ratings
 */
export async function getBookRatings(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    const ratings = await rateModel
      .find({ bookId: id })
      .populate("ratedBy", "firstName lastName avatar")
      .sort({ createdAt: -1 });

    successResponse(res, ratings, "Ratings fetched successfully");
  } catch (error) {
    logger.error("Error fetching book ratings:", { error });
    errorResponse(res, error, "Failed to fetch ratings");
  }
}

/**
 * Add rating to book
 */
export async function addBookRating(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id: bookId } = req.params;
    const { rating } = req.body as { rating: number };
    const userId = authReq.user._id;

    // Check if user has borrowed/purchased this book
    const hasBorrowed = await borrowModel.exists({
      user: userId,
      book: bookId,
      status: { $in: ["returned", "active", "overdue"] },
    });

    if (!hasBorrowed) {
      errorResponse(
        res,
        null,
        "You can only rate books that you have borrowed or purchased",
        StatusCodes.FORBIDDEN,
      );
      return;
    }

    // Create or update rating
    const existingRating = await rateModel.findOne({
      ratedBy: userId,
      bookId: bookId,
    });

    let ratingDoc;
    if (existingRating) {
      ratingDoc = await rateModel.findByIdAndUpdate(
        existingRating._id,
        { $set: { rating } },
        { new: true },
      );
    } else {
      ratingDoc = await rateModel.create({
        ratedBy: userId,
        bookId: bookId,
        rating,
      });
    }

    // Update book's average rating
    const allRatings = await rateModel.find({ bookId: bookId });
    const avgRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await bookModel.findByIdAndUpdate(bookId, {
      $set: {
        avgRating: Math.round(avgRating * 10) / 10,
        ratingCount: allRatings.length,
      },
    });

    successResponse(
      res,
      ratingDoc,
      existingRating ? "Rating updated" : "Rating added",
    );
  } catch (error) {
    logger.error("Error adding book rating:", { error });
    const err = error as Error & { code?: number };
    if (err.code === 11000) {
      errorResponse(
        res,
        err,
        "You have already rated this book",
        StatusCodes.CONFLICT,
      );
    } else {
      errorResponse(res, err, "Failed to add rating");
    }
  }
}

/**
 * Delete rating from book
 */
export async function deleteBookRating(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id: bookId, ratingId } = req.params;
    const userId = authReq.user._id;

    // Find rating
    const rating = await rateModel.findById(ratingId);

    if (!rating) {
      errorResponse(res, null, "Rating not found", StatusCodes.NOT_FOUND);
      return;
    }

    // Check ownership
    if (
      rating.ratedBy.toString() !== userId.toString() &&
      (authReq.user as { role?: string }).role !== "admin"
    ) {
      errorResponse(
        res,
        null,
        "You can only delete your own ratings",
        StatusCodes.FORBIDDEN,
      );
      return;
    }

    await rating.deleteOne();

    // Update book's average rating
    const remainingRatings = await rateModel.find({ bookId: bookId });
    const avgRating =
      remainingRatings.length > 0
        ? remainingRatings.reduce((sum, r) => sum + r.rating, 0) /
          remainingRatings.length
        : 0;

    await bookModel.findByIdAndUpdate(bookId, {
      $set: {
        avgRating: Math.round(avgRating * 10) / 10,
        ratingCount: remainingRatings.length,
      },
    });

    successResponse(res, null, "Rating deleted successfully");
  } catch (error) {
    logger.error("Error deleting book rating:", { error });
    errorResponse(res, error, "Failed to delete rating");
  }
}

/**
 * Get book recommendations for user
 */
export async function getRecommendations(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get user's borrowed/favorited books
    const user = await userModel.findById(userId).select("books");
    const favoriteIds = user?.books?.favorites || [];
    const readIds = user?.books?.read || [];

    // Get categories from user's books
    const userBooks = await bookModel
      .find({ _id: { $in: [...favoriteIds, ...readIds] } })
      .select("category author");

    const categories = [
      ...new Set(userBooks.map((b) => b.category?.toString()).filter(Boolean)),
    ];
    const authors = [...new Set(userBooks.map((b) => b.author.toString()))];

    // Find similar books user hasn't read yet
    const recommendations = await bookModel
      .find({
        _id: { $nin: [...favoriteIds, ...readIds] },
        $or: [
          {
            category: {
              $in: categories
                .filter((c): c is string => c !== undefined)
                .map((c) => new Types.ObjectId(c)),
            },
          },
          { author: { $in: authors.map((a) => new Types.ObjectId(a)) } },
        ],
        status: "in-shelf",
        availableStock: { $gt: 0 },
      })
      .populate("author", "name")
      .populate("category", "name")
      .sort({ avgRating: -1, ratingCount: -1 })
      .limit(limit);

    // If not enough recommendations, add popular books
    if (recommendations.length < limit) {
      const remainingCount = limit - recommendations.length;
      const excludeIds = [
        ...favoriteIds,
        ...readIds,
        ...recommendations.map((r) => r._id),
      ];

      const popularBooks = await bookModel
        .find({
          _id: { $nin: excludeIds },
          status: "in-shelf",
          availableStock: { $gt: 0 },
        })
        .populate("author", "name")
        .populate("category", "name")
        .sort({ avgRating: -1, ratingCount: -1 })
        .limit(remainingCount);

      recommendations.push(...popularBooks);
    }

    successResponse(
      res,
      recommendations,
      "Recommendations fetched successfully",
    );
  } catch (error) {
    logger.error("Error fetching recommendations:", { error });
    errorResponse(res, error, "Failed to fetch recommendations");
  }
}

/**
 * Get popular/trending books
 */
export async function getPopularBooks(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const books = await bookModel
      .find({ status: "in-shelf" })
      .populate("author", "name")
      .populate("category", "name")
      .sort({ ratingCount: -1, avgRating: -1 })
      .limit(limit);

    successResponse(res, books, "Popular books fetched successfully");
  } catch (error) {
    logger.error("Error fetching popular books:", { error });
    errorResponse(res, error, "Failed to fetch popular books");
  }
}

/**
 * Get new arrivals
 */
export async function getNewArrivals(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const books = await bookModel
      .find({ status: "in-shelf" })
      .populate("author", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    successResponse(res, books, "New arrivals fetched successfully");
  } catch (error) {
    logger.error("Error fetching new arrivals:", { error });
    errorResponse(res, error, "Failed to fetch new arrivals");
  }
}

/**
 * Search books
 */
export async function searchBooks(req: Request, res: Response): Promise<void> {
  try {
    const {
      q,
      limit = 20,
      page = 1,
    } = req.query as {
      q: string;
      limit?: string | number;
      page?: string | number;
    };

    if (!q) {
      errorResponse(
        res,
        null,
        "Search query is required",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    const limitNum = Number(limit);
    const pageNum = Number(page);

    const [books, total] = await Promise.all([
      bookModel
        .find({ $text: { $search: q } }, { score: { $meta: "textScore" } })
        .populate("author", "name")
        .populate("category", "name")
        .sort({ score: { $meta: "textScore" } })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      bookModel.countDocuments({ $text: { $search: q } }),
    ]);

    paginatedResponse(
      res,
      books,
      {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      "Search results",
    );
  } catch (error) {
    logger.error("Error searching books:", { error });
    errorResponse(res, error, "Search failed");
  }
}

/**
 * Get books by category
 */
export async function getBooksByCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { categoryId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;

    const [books, total] = await Promise.all([
      bookModel
        .find({ category: categoryId, status: "in-shelf" })
        .populate("author", "name")
        .populate("category", "name")
        .skip((page - 1) * limit)
        .limit(limit),
      bookModel.countDocuments({ category: categoryId, status: "in-shelf" }),
    ]);

    paginatedResponse(
      res,
      books,
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      "Books fetched successfully",
    );
  } catch (error) {
    logger.error("Error fetching books by category:", { error });
    errorResponse(res, error, "Failed to fetch books by category");
  }
}

/**
 * Get books by author
 */
export async function getBooksByAuthor(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { authorId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;

    const [books, total] = await Promise.all([
      bookModel
        .find({ author: authorId, status: "in-shelf" })
        .populate("author", "name")
        .populate("category", "name")
        .skip((page - 1) * limit)
        .limit(limit),
      bookModel.countDocuments({ author: authorId, status: "in-shelf" }),
    ]);

    paginatedResponse(
      res,
      books,
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      "Books fetched successfully",
    );
  } catch (error) {
    logger.error("Error fetching books by author:", { error });
    errorResponse(res, error, "Failed to fetch books by author");
  }
}
