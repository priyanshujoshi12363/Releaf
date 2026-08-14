import JWT from "jsonwebtoken";
import config from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const signAccessToken = (userId) =>
  JWT.sign({ sub: String(userId) }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

export const requireAuth = (req, _res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(ApiError.unauthorized("Missing or malformed Authorization header"));
  }

  try {
    const payload = JWT.verify(token, config.jwt.secret);
    req.userId = payload.sub;
    return next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired, please log in again"
        : "Invalid authentication token";
    return next(ApiError.unauthorized(message));
  }
};

export const requireSelf = ({ param, field } = {}) => (req, _res, next) => {
  const targetId = (param && req.params[param]) || (field && req.body[field]);

  if (!targetId) {
    return next(ApiError.badRequest(`${param || field} is required`));
  }
  if (String(targetId) !== String(req.userId)) {
    return next(ApiError.forbidden("You can only act on your own account"));
  }
  return next();
};
