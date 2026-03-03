import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userModel from "../models/users.js";
import { logger } from "../utils/logger.js";
import { successResponse, errorResponse } from "../utils/responseFormatter.js";
import type { AuthenticatedRequest } from "../types/express.js";

/**
 * Get all users (Admin)
 */
export async function getUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await userModel.find();
    successResponse(res, users, "Users fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Failed to fetch users");
  }
}

/**
 * Create a new user (Admin)
 */
export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await userModel.create(req.body);
    successResponse(
      res,
      user,
      "User created successfully",
      StatusCodes.CREATED,
    );
  } catch (error) {
    const err = error as Error & { code?: number };
    if (err.code === 11000) {
      errorResponse(res, err, "User already exists", StatusCodes.CONFLICT);
    } else {
      errorResponse(res, err, "Failed to create user", StatusCodes.BAD_REQUEST);
    }
  }
}

/**
 * Get user by ID (Admin)
 */
export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
      return;
    }
    successResponse(res, user, "User fetched successfully");
  } catch (error) {
    errorResponse(res, error, `Failed to fetch user ${req.params.id}`);
  }
}

/**
 * Update user (Admin)
 */
export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    if (!user) {
      errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
      return;
    }
    successResponse(res, user, "User updated successfully");
  } catch (error) {
    errorResponse(res, error, `Failed to update user ${req.params.id}`);
  }
}

/**
 * Delete user (Admin)
 */
export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
      return;
    }
    successResponse(res, user, "User deleted successfully");
  } catch (error) {
    errorResponse(res, error, `Failed to delete user ${req.params.id}`);
  }
}

/**
 * Add book to favorites
 */
export async function addToFavorites(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { bookId } = req.body as { bookId: string };
    const userId = authReq.user._id;

    const user = await userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { "books.favorites": bookId } },
        { new: true },
      )
      .select("-password");

    if (!user) {
      errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, user.books.favorites, "Book added to favorites");
  } catch (error) {
    errorResponse(res, error, "Failed to add book to favorites");
  }
}

/**
 * Remove book from favorites
 */
export async function removeFromFavorites(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { bookId } = req.params;
    const userId = authReq.user._id;

    const user = await userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { "books.favorites": bookId } },
        { new: true },
      )
      .select("-password");

    if (!user) {
      errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, user.books.favorites, "Book removed from favorites");
  } catch (error) {
    errorResponse(res, error, "Failed to remove book from favorites");
  }
}

/**
 * Get user's favorite books
 */
export async function getFavorites(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;

    const user = await userModel
      .findById(userId)
      .populate("books.favorites", "title author cover price avgRating")
      .select("books.favorites");

    if (!user) {
      errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(
      res,
      user.books.favorites,
      "Favorites fetched successfully",
    );
  } catch (error) {
    errorResponse(res, error, "Failed to fetch favorites");
  }
}

/**
 * Toggle favorite (add if not exists, remove if exists)
 */
export async function toggleFavorite(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const { bookId } = req.body as { bookId: string };
    const userId = authReq.user._id;

    const user = await userModel.findById(userId);
    if (!user) {
      errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
      return;
    }

    const isFavorite = user.books.favorites.some(
      (id) => id.toString() === bookId,
    );

    if (isFavorite) {
      await userModel.findByIdAndUpdate(userId, {
        $pull: { "books.favorites": bookId },
      });
    } else {
      await userModel.findByIdAndUpdate(userId, {
        $addToSet: { "books.favorites": bookId },
      });
    }

    const updatedUser = await userModel.findById(userId).select("-password");

    successResponse(
      res,
      {
        favorites: updatedUser?.books.favorites,
        isFavorite: !isFavorite,
      },
      isFavorite ? "Book removed from favorites" : "Book added to favorites",
    );
  } catch (error) {
    errorResponse(res, error, "Failed to toggle favorite");
  }
}

/**
 * Get current user profile
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;

    const user = await userModel.findById(userId).select("-password").lean();

    if (!user) {
      errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
      return;
    }

    // Get statistics
    const stats = {
      totalBorrowedBooks: user.books?.borrowed?.length || 0,
      totalReadBooks: user.books?.read?.length || 0,
      totalFavorites: user.books?.favorites?.length || 0,
    };

    successResponse(res, { ...user, stats }, "Profile fetched successfully");
  } catch (error) {
    logger.error("Error in getProfile:", { error });
    errorResponse(
      res,
      error,
      "Failed to fetch profile",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;
    const { firstName, lastName, phone, avatar } = req.body as {
      firstName?: string;
      lastName?: string;
      phone?: string;
      avatar?: string;
    };

    // Only allow specific fields to be updated
    const updates: Record<string, string | null> = {};
    if (firstName !== undefined && firstName !== "")
      updates.firstName = firstName;
    if (lastName !== undefined && lastName !== "") updates.lastName = lastName;
    if (phone !== undefined) updates.phone = phone || null;
    if (avatar !== undefined) updates.avatar = avatar || null;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true },
      )
      .select("-password");

    if (!updatedUser) {
      errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, updatedUser, "Profile updated successfully");
  } catch (error) {
    logger.error("Error in updateProfile:", { error });
    errorResponse(
      res,
      error,
      "Failed to update profile",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

/**
 * Change user password
 */
export async function changePassword(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    // Get user with password
    const user = await userModel.findById(userId);
    if (!user) {
      errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
      return;
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      errorResponse(
        res,
        null,
        "Current password is incorrect",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    successResponse(res, null, "Password changed successfully");
  } catch (error) {
    logger.error("Error in changePassword:", { error });
    errorResponse(res, error, "Failed to change password");
  }
}
