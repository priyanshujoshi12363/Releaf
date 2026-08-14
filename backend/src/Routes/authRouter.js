import { Router } from "express";
import { login, Register } from "../controllers/AuthController.js";
import {
  AddinClanBYclanCode,
  createClan,
  getClanData,
  getIntroductionData,
  getNaturalData,
  getProgressData,
  getquizedata,
  getStudentData,
  IncreaseXp,
} from "../controllers/Gamelogic.js";
import { requireAuth, requireSelf } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validate.js";
import { upload } from "../middleware/upload.js";
import { authLimiter, uploadLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  uploadLimiter,
  upload.single("Avatar"),
  validate(schemas.register),
  Register
);

router.post("/login", authLimiter, validate(schemas.login), login);

router.use(requireAuth);

router.get(
  "/game/:studentId",
  validate(schemas.studentIdParam),
  requireSelf({ param: "studentId" }),
  getStudentData
);

router.post(
  "/Xp",
  validate(schemas.addXp),
  requireSelf({ field: "studentId" }),
  IncreaseXp
);

router.post(
  "/quize/:studentId",
  validate(schemas.quizResult),
  requireSelf({ param: "studentId" }),
  getquizedata
);

router.get(
  "/wholedata/:studentId",
  validate(schemas.studentIdParam),
  requireSelf({ param: "studentId" }),
  getProgressData
);

router.get(
  "/intro/:studentId",
  validate(schemas.studentIdParam),
  requireSelf({ param: "studentId" }),
  getIntroductionData
);

router.get(
  "/convo/:studentId",
  validate(schemas.studentIdParam),
  requireSelf({ param: "studentId" }),
  getNaturalData
);

router.post(
  "/create/clan/:playerId",
  uploadLimiter,
  upload.single("avatar"),
  validate(schemas.createClan),
  requireSelf({ param: "playerId" }),
  createClan
);

router.get(
  "/clan/:studentId",
  validate(schemas.studentIdParam),
  requireSelf({ param: "studentId" }),
  getClanData
);

router.post(
  "/join",
  validate(schemas.joinClan),
  requireSelf({ field: "studentId" }),
  AddinClanBYclanCode
);

export default router;
