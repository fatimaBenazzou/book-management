import { Router } from "express";
import { login, register, checkUser } from "../handlers/auth.js";
import { CheckAuth } from "../middlewares/auth.js";
import { validateBodySchema } from "../middlewares/validations.js";
import { loginSchema, userSchema } from "../validation/users.js";

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", validateBodySchema(loginSchema), login);

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", validateBodySchema(userSchema), register);

/**
 * @route   GET /api/auth/check
 * @desc    Check if user is authenticated
 * @access  Private
 */
router.get("/check", CheckAuth, checkUser);

export default router;
