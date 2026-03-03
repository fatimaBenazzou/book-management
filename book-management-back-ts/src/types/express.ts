import type { Request } from "express";
import type { IUserDocument } from "./models/user.js";

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  /** Authenticated user attached by auth middleware */
  user: IUserDocument;
}

/**
 * Extended Request with parsed query parameters
 */
export interface RequestWithParsedQuery<T = unknown> extends Request {
  /** Parsed and validated query parameters */
  parsedQuery: T;
}

/**
 * Combined filter query (pagination + sort + search)
 */
export interface FilterQuery {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 1 | -1;
  search?: string;
  category?: string;
}
