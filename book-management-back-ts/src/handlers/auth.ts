import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import userModel from "../models/users.js";
import type { AuthenticatedRequest } from "../types/express.js";

/**
 * JWT payload structure
 */
interface JwtPayload {
  _id: string;
  createdAt: Date;
}

/**
 * Login handler
 * Authenticates user with email and password
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Wrong email/password",
      });
      return;
    }

    const isPasswordCorrect = await user.comparePassword(password);
    console.log({ isPasswordCorrect });
    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        message: "Wrong password/email",
      });
      return;
    }

    const userInfo: JwtPayload = {
      _id: user._id.toString(),
      createdAt: new Date(),
    };

    const token = jwt.sign(userInfo, process.env.AUTH_SECRET as string);

    // Remove password from response
    const userObject = user.toObject();
    console.log(userObject.password);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...safeUser } = userObject;

    res.status(StatusCodes.OK).json({
      success: true,
      message: "You have logged in",
      data: safeUser,
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to login",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Register handler
 * Creates a new user account
 */
export async function register(req: Request, res: Response): Promise<void> {
  const user = req.body;
  try {
    const createdUser = await userModel.create(user);

    const userInfo: JwtPayload = {
      _id: createdUser._id.toString(),
      createdAt: new Date(),
    };

    const token = jwt.sign(userInfo, process.env.AUTH_SECRET as string);

    // Remove password from response
    const userObject = createdUser.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...safeUser } = userObject;

    res.status(StatusCodes.OK).json({
      success: true,
      message: "You have registered",
      data: safeUser,
      token,
    });
  } catch (err) {
    const error = err as Error & { code?: number };

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user validation",
        error: error.message,
      });
    }
  }
}

/**
 * Check user handler
 * Returns current authenticated user info
 */
export async function checkUser(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const user = authReq.user;

  if (!user) {
    res.status(401).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.json({
    success: true,
    message: "User is authenticated",
    data: user,
  });
}
