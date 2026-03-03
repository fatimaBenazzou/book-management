import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./services/db.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    logger.info("Connected to MongoDB");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((error) => {
    logger.error("Failed to start server:", { error });
    process.exit(1);
  });
