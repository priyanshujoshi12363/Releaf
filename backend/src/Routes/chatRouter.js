import { Router } from "express";
import { chat } from "../controllers/ChatController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validate.js";
import { chatLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/", requireAuth, chatLimiter, validate(schemas.chat), chat);

export default router;
