import Joi from "joi";
import { ApiError } from "../utils/ApiError.js";

const objectId = Joi.string().hex().length(24).messages({
  "string.hex": "must be a valid id",
  "string.length": "must be a valid id",
});

export const validate = (schemas) => (req, _res, next) => {
  for (const source of ["params", "body"]) {
    const schema = schemas[source];
    if (!schema) continue;

    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return next(
        ApiError.badRequest(
          "Validation failed",
          error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
          }))
        )
      );
    }

    if (source === "params") Object.assign(req.params, value);
    else req.body = value;
  }

  return next();
};

export const schemas = {
  register: {
    body: Joi.object({
      PlayerName: Joi.string().trim().min(3).max(50).required().messages({
        "string.empty": "Player name cannot be empty",
        "string.min": "Player name must be at least 3 characters",
        "any.required": "Player name is required",
      }),
      email: Joi.string().trim().lowercase().email().max(254).required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required",
      }),
      password: Joi.string().min(8).max(128).required().messages({
        "string.min": "Password must be at least 8 characters",
        "any.required": "Password is required",
      }),
      PhoneNO: Joi.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
          "string.pattern.base": "Phone number must be exactly 10 digits",
          "any.required": "Phone number is required",
        }),
    }),
  },

  login: {
    body: Joi.object({
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string().max(128).required(),
    }),
  },

  studentIdParam: {
    params: Joi.object({ studentId: objectId.required() }),
  },

  playerIdParam: {
    params: Joi.object({ playerId: objectId.required() }),
  },

  addXp: {
    body: Joi.object({
      studentId: objectId.required(),

      playerXp: Joi.number().integer().min(1).max(500).required(),
      topic: Joi.string()
        .valid(
          "introduction",
          "conservation",
          "pollution",
          "climate",
          "sustainable",
          "biodiversity",
          "environment",
          "real_world"
        )
        .required(),
    }),
  },

  quizResult: {
    params: Joi.object({ studentId: objectId.required() }),
    body: Joi.object({
      playerXp: Joi.number().integer().min(1).max(500).required(),
    }),
  },

  createClan: {
    params: Joi.object({ playerId: objectId.required() }),
    body: Joi.object({
      clanName: Joi.string().trim().min(3).max(40).required(),
      desc: Joi.string().trim().min(3).max(300).required(),
    }),
  },

  joinClan: {
    body: Joi.object({
      studentId: objectId.required(),
      clanCode: Joi.string().trim().uppercase().alphanum().length(6).required(),
    }),
  },

  chat: {
    body: Joi.object({
      message: Joi.string().trim().min(1).max(1000).required().messages({
        "string.max": "Message is too long (1000 characters max)",
        "any.required": "Message is required",
      }),
    }),
  },
};

export default validate;
