import mongoose from "mongoose";
import config from "../config/env.js";
import logger from "../utils/logger.js";

export const connectDB = async () => {
  mongoose.set("strictQuery", true);

  mongoose.connection.on("error", (error) => {
    logger.error("MongoDB connection error", { message: error.message });
  });
  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  const connection = await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10_000,
    maxPoolSize: 10,
  });

  logger.info("MongoDB connected", { host: connection.connection.host });
  return connection;
};

export const disconnectDB = () => mongoose.connection.close(false);

export default connectDB;
