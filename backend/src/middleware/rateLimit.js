import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

const build = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => next(ApiError.tooManyRequests(message)),
  });

export const globalLimiter = build({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests, please try again in a few minutes",
});

export const authLimiter = build({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many login attempts, please try again in 15 minutes",
});

export const chatLimiter = build({
  windowMs: 60 * 1000,
  max: 10,
  message: "You're sending messages too quickly, please wait a moment",
});

export const uploadLimiter = build({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Upload limit reached, please try again later",
});
