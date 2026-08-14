import config from "./src/config/env.js";
import createApp from "./src/app.js";
import { connectDB, disconnectDB } from "./src/DB/index.js";
import logger from "./src/utils/logger.js";

const start = async () => {
  await connectDB();

  const server = createApp().listen(config.port, () => {
    logger.info(`ReLeaf API listening on port ${config.port}`, {
      environment: config.nodeEnv,
    });
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", { reason: String(reason) });
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", { message: error.message, stack: error.stack });
    process.exit(1);
  });
};

start().catch((error) => {
  logger.error("Failed to start server", { message: error.message });
  process.exit(1);
});
