import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/users.js";
import type { AuthenticatedRequest } from "../types/express.js";

/**
 * JWT payload structure
 */
interface JwtPayload {
  _id: string;
  createdAt: string;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Next middleware function
 */
export async function CheckAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token doesn't exist",
      });
      return;
    }

    // Verify token
    const verified = jwt.verify(
      token,
      process.env.AUTH_SECRET as string,
    ) as JwtPayload;

    if (!verified) {
      res.status(401).json({
        success: false,
        message: "Unverified token used",
      });
      return;
    }

    // Find user and attach to request
    const user = await userModel.findById(verified._id).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found or deleted",
      });
      return;
    }

    // Attach user to request
    (req as AuthenticatedRequest).user = user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Error in validating token",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

/**
 * Admin role middleware
 * Must be used after CheckAuth middleware
 *
 * @param req - Express request with authenticated user
 * @param res - Express response
 * @param next - Next middleware function
 */
export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;

  if (authReq.user?.role === "admin") {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "You are not an admin, you can't access this route",
    });
  }
}
