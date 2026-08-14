import { Student, PROGRESS_TOPICS } from "../models/Student.model.js";
import { Clan, generateClanCode } from "../models/Clan.model.js";
import { uploadOnCloudinary, destroyFromCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

const XP_PER_LEVEL = 100;
const REWARD_PER_LEVEL = 10;

const MAX_PERCENT = 100;

const clampPercent = (value) => Math.min(Math.max(value, 0), MAX_PERCENT);

const emptyProgress = () =>
  Object.fromEntries(PROGRESS_TOPICS.map((topic) => [topic, 0]));

const readProgress = (student) => {
  const stored = Array.isArray(student.progress)
    ? student.progress[0]
    : student.progress;
  const source = stored?.toObject?.() ?? stored ?? {};
  return Object.fromEntries(
    PROGRESS_TOPICS.map((topic) => [topic, Number(source[topic]) || 0])
  );
};

const loadStudent = async (studentId, projection) => {
  const student = await Student.findById(studentId).select(projection ?? "-__v");
  if (!student) throw ApiError.notFound("Student not found");
  return student;
};

export const getStudentData = asyncHandler(async (req, res) => {
  const student = await loadStudent(req.params.studentId);

  return res.status(200).json({
    success: true,
    message: "Student data fetched successfully",
    student,
  });
});

export const IncreaseXp = asyncHandler(async (req, res) => {
  const { studentId, playerXp, topic } = req.body;

  const student = await loadStudent(studentId);

  if (Array.isArray(student.progress) || !student.progress) {
    student.progress = { ...emptyProgress(), ...readProgress(student) };
  }

  student.playerXp += playerXp;
  student.progress[topic] = (student.progress[topic] || 0) + playerXp;

  while (student.playerXp >= XP_PER_LEVEL) {
    student.playerXp -= XP_PER_LEVEL;
    student.Level += 1;
    student.EcoLearn = clampPercent(student.EcoLearn + REWARD_PER_LEVEL);
    student.GamePoint = clampPercent(student.GamePoint + REWARD_PER_LEVEL);
  }

  student.markModified("progress");
  await student.save();

  return res.status(200).json({
    message: "XP updated successfully",
    playerXp: student.playerXp,
    level: student.Level,
    ecoLearn: student.EcoLearn,
    gamePoint: student.GamePoint,
    progress: student.progress,
  });
});

export const getquizedata = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { playerXp } = req.body;

  const student = await loadStudent(studentId);

  student.Quize = clampPercent(student.Quize + playerXp);
  student.playerXp += playerXp;

  while (student.playerXp >= XP_PER_LEVEL) {
    student.playerXp -= XP_PER_LEVEL;
    student.Level += 1;
    student.EcoLearn = clampPercent(student.EcoLearn + REWARD_PER_LEVEL);
    student.GamePoint = clampPercent(student.GamePoint + REWARD_PER_LEVEL);
  }

  await student.save();

  return res.status(200).json({
    message: "Quiz XP added successfully",
    updatedStudent: student,
  });
});

export const getProgressData = asyncHandler(async (req, res) => {
  const student = await loadStudent(req.params.studentId, "progress");

  return res.status(200).json({
    studentId: student._id,
    progress: readProgress(student),
  });
});

export const getIntroductionData = asyncHandler(async (req, res) => {
  const student = await loadStudent(req.params.studentId, "progress");

  return res.status(200).json({
    studentId: student._id,
    introduction: readProgress(student).introduction,
  });
});

export const getNaturalData = asyncHandler(async (req, res) => {
  const student = await loadStudent(req.params.studentId, "progress");

  return res.status(200).json({
    studentId: student._id,
    conservation: readProgress(student).conservation,
  });
});

export const createClan = asyncHandler(async (req, res) => {
  const { playerId } = req.params;
  const { clanName, desc } = req.body;

  if (!req.file) {
    throw ApiError.badRequest("Clan avatar is required");
  }

  if (await Clan.exists({ leader: playerId })) {
    throw ApiError.conflict("You already lead a clan");
  }

  const uploaded = await uploadOnCloudinary(req.file.buffer, {
    folder: "clan-avatars",
    transformation: [{ width: 500, crop: "limit" }, { quality: "auto" }],
  });

  try {
    const clan = await Clan.create({
      clanName,
      desc,
      avatar: { url: uploaded.secure_url, public_id: uploaded.public_id },
      leader: playerId,

      ClanMember: [{ player: playerId }],
      clanCode: generateClanCode(),
    });

    await Student.findByIdAndUpdate(playerId, { clan: clan._id });

    logger.info("Clan created", { clanId: String(clan._id), leader: playerId });

    return res.status(201).json({
      success: true,
      message: "Clan created successfully",
      clan,
    });
  } catch (error) {
    await destroyFromCloudinary(uploaded.public_id);
    throw error;
  }
});

export const getClanData = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const clan = await Clan.findOne({
    $or: [{ leader: studentId }, { "ClanMember.player": studentId }],
  })
    .populate("leader", "PlayerName email Avatar")
    .populate("ClanMember.player", "PlayerName email Avatar Level");

  if (!clan) {
    throw ApiError.notFound("You are not part of any clan yet");
  }

  return res.status(200).json({
    success: true,
    message: "Clan data fetched successfully",
    clan,
  });
});

export const AddinClanBYclanCode = asyncHandler(async (req, res) => {
  const { clanCode, studentId } = req.body;

  const clan = await Clan.findOne({ clanCode });
  if (!clan) {
    throw ApiError.notFound("No clan found with this code");
  }

  if (clan.hasMember(studentId)) {
    throw ApiError.conflict("You are already in this clan");
  }
  if (clan.ClanMember.length >= Clan.MAX_MEMBERS) {
    throw ApiError.conflict("This clan is full");
  }

  clan.ClanMember.push({ player: studentId });
  await clan.save();
  await Student.findByIdAndUpdate(studentId, { clan: clan._id });

  return res.status(200).json({
    success: true,
    message: "Joined the clan successfully",
    clan,
  });
});
