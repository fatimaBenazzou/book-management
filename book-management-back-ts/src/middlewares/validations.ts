import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod/v4";
import { prettifyError } from "zod/v4";

/**
 * Extended request with parsed query
 */
interface RequestWithParsedQuery extends Request {
  parsedQuery?: unknown;
}

/**
 * Validate request body against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export function validateBodySchema<T>(schema: ZodSchema<T>) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const parsed = schema.safeParse(req.body);
    if (parsed.success) {
      req.body = parsed.data; // apply transforms (e.g. string → Date)
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: prettifyError(parsed.error),
      });
    }
  };
}

/**
 * Validate request query parameters against a Zod schema
 * Attaches parsed data to req.parsedQuery
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export function validateQuerySchema<T>(schema: ZodSchema<T>) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const parsed = schema.safeParse(req.query);
    if (parsed.success) {
      (req as RequestWithParsedQuery).parsedQuery = parsed.data;
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: prettifyError(parsed.error),
      });
    }
  };
}

/**
 * Validate URL parameters against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export function validateParamsSchema<T>(schema: ZodSchema<T>) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const parsed = schema.safeParse(req.params);
    if (parsed.success) {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: prettifyError(parsed.error),
      });
    }
  };
}
