import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import authorModel from "../models/author.js";
import type { RequestWithParsedQuery } from "../types/express.js";
import { logger } from "../utils/logger.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/responseFormatter.js";

/**
 * Author query interface — mirrors authorQuerySchema output
 */
interface AuthorQuery {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: 1 | -1;
  search?: string;
}

/**
 * Get all authors with pagination and search
 */
export async function getAuthors(req: Request, res: Response): Promise<void> {
  try {
    const parsedReq = req as RequestWithParsedQuery<AuthorQuery>;
    const {
      limit = 10,
      page = 1,
      sortBy = "createdAt",
      sortOrder = -1,
      search,
    } = parsedReq.parsedQuery;

    const filter = search ? { name: { $regex: search, $options: "i" } } : {};

    const [authors, total] = await Promise.all([
      authorModel
        .find(filter)
        .populate("books", "title cover")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ [sortBy]: sortOrder }),
      authorModel.countDocuments(filter),
    ]);

    paginatedResponse(
      res,
      authors,
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      "Authors fetched successfully",
    );
  } catch (error) {
    logger.error("Error fetching authors:", { error });
    errorResponse(res, error, "Failed to fetch authors");
  }
}

/**
 * Get single author by ID with their books
 */
export async function getAuthorById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const author = await authorModel.findById(req.params.id).populate("books");

    if (!author) {
      errorResponse(res, null, "Author not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, author, "Author fetched successfully");
  } catch (error) {
    logger.error("Error fetching author:", { error });
    errorResponse(res, error, `Failed to fetch author ${req.params.id}`);
  }
}

/**
 * Create new author (Admin only)
 */
export async function createAuthor(req: Request, res: Response): Promise<void> {
  try {
    const author = await authorModel.create(req.body);

    successResponse(
      res,
      author,
      "Author created successfully",
      StatusCodes.CREATED,
    );
  } catch (error) {
    logger.error("Error creating author:", { error });
    const err = error as Error & { code?: number };
    if (err.code === 11000) {
      errorResponse(res, err, "Author already exists", StatusCodes.CONFLICT);
    } else {
      errorResponse(
        res,
        err,
        "Failed to create author",
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

/**
 * Update author (Admin only)
 */
export async function updateAuthor(req: Request, res: Response): Promise<void> {
  try {
    const author = await authorModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    if (!author) {
      errorResponse(res, null, "Author not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, author, "Author updated successfully");
  } catch (error) {
    logger.error("Error updating author:", { error });
    errorResponse(res, error, `Failed to update author ${req.params.id}`);
  }
}

/**
 * Delete author (Admin only) - check if author has books
 */
export async function deleteAuthor(req: Request, res: Response): Promise<void> {
  try {
    const author = await authorModel.findById(req.params.id).populate("books");

    if (!author) {
      errorResponse(res, null, "Author not found", StatusCodes.NOT_FOUND);
      return;
    }

    // Check if author has any books via virtual
    const authorWithBooks = author as typeof author & { books?: unknown[] };
    if (authorWithBooks.books && authorWithBooks.books.length > 0) {
      errorResponse(
        res,
        null,
        "Cannot delete author with existing books. Please reassign or delete the books first.",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    await authorModel.findByIdAndDelete(req.params.id);

    successResponse(res, null, "Author deleted successfully");
  } catch (error) {
    logger.error("Error deleting author:", { error });
    errorResponse(res, error, `Failed to delete author ${req.params.id}`);
  }
}
