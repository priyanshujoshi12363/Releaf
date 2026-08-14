import bcrypt from "bcrypt";
import { Student } from "../models/Student.model.js";
import { uploadOnCloudinary, destroyFromCloudinary } from "../utils/cloudinary.js";
import { signAccessToken } from "../middleware/auth.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

const BCRYPT_ROUNDS = 12;

const publicProfile = (student) => ({
  _id: student._id,
  PlayerName: student.PlayerName,
  email: student.email,
  PhoneNO: student.PhoneNO,
  Avatar: student.Avatar,
  Level: student.Level,
  playerXp: student.playerXp,
});

export const Register = asyncHandler(async (req, res) => {
  const { PlayerName, email, password, PhoneNO } = req.body;

  if (!req.file) {
    throw ApiError.badRequest("Avatar image is required");
  }

  if (await Student.exists({ email })) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const uploaded = await uploadOnCloudinary(req.file.buffer, {
    folder: "player-avatars",
    transformation: [{ width: 500, crop: "limit" }, { quality: "auto" }],
  });

  try {
    const student = await Student.create({
      PlayerName,
      email,
      password: await bcrypt.hash(password, BCRYPT_ROUNDS),
      PhoneNO,
      Avatar: { url: uploaded.secure_url, public_id: uploaded.public_id },
      playerXp: 10,
      Level: 1,
      streak: 1,
    });

    logger.info("Player registered", { studentId: String(student._id) });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: publicProfile(student),
    });
  } catch (error) {

    await destroyFromCloudinary(uploaded.public_id);
    throw error;
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email }).select("+password");

  const hash = student?.password || "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva";
  const passwordMatches = await bcrypt.compare(password, hash);

  if (!student || !passwordMatches) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  logger.info("Player logged in", { studentId: String(student._id) });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token: signAccessToken(student._id),
    user: publicProfile(student),
  });
});
