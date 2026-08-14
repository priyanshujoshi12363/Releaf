import multer from "multer";
import mongoose from "mongoose";
import config from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

export const notFoundHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

const normalise = (error) => {
  if (error instanceof ApiError) return error;

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return ApiError.badRequest("Image is too large (5MB maximum)");
    }
    return ApiError.badRequest(
      error.field ? `${error.message} (field: ${error.field})` : error.message
    );
  }

  if (error instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for "${error.path}"`);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return ApiError.badRequest(
      "Validation failed",
      Object.values(error.errors).map((e) => ({ field: e.path, message: e.message }))
    );
  }

  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "value";
    return ApiError.conflict(`That ${field} is already taken`);
  }

  if (error?.type === "entity.parse.failed") {
    return ApiError.badRequest("Request body is not valid JSON");
  }

  return ApiError.internal();
};

export const errorHandler = (error, req, res, _next) => {
  const apiError = normalise(error);

  if (apiError.statusCode >= 500) {
    logger.error("Unhandled request error", {
      method: req.method,
      path: req.originalUrl,
      message: error?.message,
      stack: config.isProduction ? undefined : error?.stack,
    });
  } else {
    logger.debug("Request rejected", {
      method: req.method,
      path: req.originalUrl,
      status: apiError.statusCode,
      message: apiError.message,
    });
  }

  const headline =
    apiError.details?.length && apiError.statusCode === 400
      ? apiError.details[0].message
      : apiError.message;

  res.status(apiError.statusCode).json({
    success: false,
    message: headline,
    ...(apiError.details ? { errors: apiError.details } : {}),
  });
};
