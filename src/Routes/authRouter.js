import multer from "multer";
import { Router } from "express";
import { login, Register } from "../controllers/AuthController.js";
import { AddinClanBYclanCode, createClan, getClanData, getIntroductionData, getNaturalData, getProgressData, getquizedata, getStudentData, IncreaseXp, LevelIncrease } from "../controllers/Gamelogic.js";


// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and GIF images are allowed"), false);
    }
  },
});

const router = Router();

// Add multer middleware
router.post("/register", upload.single("Avatar"),  Register);
router.post("/login" , login)
router.get("/game/:studentId" ,getStudentData )
router.post('/Xp' , IncreaseXp)
router.post('/Level' , LevelIncrease)
router.post('/create/clan/:playerId' ,upload.single("avatar") , createClan)
router.get('/clan/:studentId' , getClanData)
router.post('/join' , AddinClanBYclanCode)
router.get('/intro/:studentId' , getIntroductionData)
router.get("/convo/:studentId" ,getNaturalData )
router.get("/wholedata/:studentId" , getProgressData)
router.post('/quize/:studentId' , getquizedata)
export default router;
