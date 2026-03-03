import express from "express";
import cors from "cors";

// Middleware imports
import { errorHandler } from "./middlewares/errorHandler.js";

// Router imports
import authRouter from "./routers/auth.js";
import userRouter from "./routers/users.js";
import bookRouter from "./routers/book.js";
import categoryRouter from "./routers/category.js";
import authorRouter from "./routers/author.js";
import borrowRouter from "./routers/borrow.js";
import orderRouter from "./routers/orders.js";
import adminRouter from "./routers/admin.js";
import { StatusCodes } from "http-status-codes";

const app = express();

// =====================
// Global Middleware
// =====================

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN || "http://localhost:5173",
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =====================
// API Routes
// =====================

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/categories", categoryRouter);
app.use("/authors", authorRouter);
app.use("/borrows", borrowRouter);
app.use("/orders", orderRouter);
app.use("/admin", adminRouter);

// =====================
// Health check
// =====================
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// =====================
// Error Handling
// =====================

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
