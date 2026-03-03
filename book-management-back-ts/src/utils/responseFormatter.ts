import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiPaginatedResponse,
  PaginationMeta,
} from "../types/responses.js";

/**
 * Standard success response formatter
 *
 * @param res - Express response object
 * @param data - Response data
 * @param message - Success message
 * @param statusCode - HTTP status code (default: 200)
 */
export function successResponse<T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = StatusCodes.OK,
): Response<ApiSuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Standard error response formatter
 *
 * @param res - Express response object
 * @param error - Error object or message
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 */
export function errorResponse(
  res: Response,
  error: Error | string | unknown,
  message: string = "Error occurred",
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
): Response<ApiErrorResponse> {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : undefined;

  return res.status(statusCode).json({
    success: false,
    message,
    error: errorMessage,
  });
}

/**
 * Standard paginated response formatter
 *
 * @param res - Express response object
 * @param data - Array of response data
 * @param pagination - Pagination metadata
 * @param message - Success message
 * @param statusCode - HTTP status code (default: 200)
 */
export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message: string = "Success",
  statusCode: number = StatusCodes.OK,
): Response<ApiPaginatedResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
}
