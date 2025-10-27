import multer from "multer";
import { Student } from "../models/Student.model.js";
import { Clan } from "../models/Clan.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
export const getStudentData = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required in params" });
    }

    const student = await Student.findById(studentId).select("-password -__v"); 
    // 👆 removes password and __v fields (for safety)

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student data fetched successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const IncreaseXp = async (req, res) => {
  try {
    const { studentId, level, playerXp, topic } = req.body;

    if (!studentId || playerXp === undefined || level === undefined || !topic) {
      return res
        .status(400)
        .json({ message: "studentId, level, playerXp and topic are required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🛠 Fix for old docs → if progress is [] reset it
    if (Array.isArray(student.progress)) {
      student.progress = {
        introduction: 0,
        conservation: 0,
        pollution: 0,
        climate: 0,
        Sustainable: 0,
        biodiversity: 0,
        Environment: 0,
        Real_world: 0,
      };
    }

    // ✅ Add XP
    student.playerXp += playerXp;
    student.Level = level; // frontend may override level

    // ✅ Update topic progress
    if (student.progress?.[topic] !== undefined) {
      student.progress[topic] += playerXp;
    } else {
      return res.status(400).json({ message: `Invalid topic: ${topic}` });
    }

    // ✅ Level up check
    while (student.playerXp >= 100) {
      student.Level += 1;
      student.playerXp -= 100;

      // On each level up → add 10 EcoLearn & GamePoint
      student.EcoLearn += 10;
      student.GamePoint += 10;
    }

    await student.save();

    res.json({
      message: "XP updated successfully",
      playerXp: student.playerXp,
      level: student.Level,
      ecoLearn: student.EcoLearn,
      gamePoint: student.GamePoint,
      progress: student.progress,
    });
  } catch (error) {
    console.error("Error updating XP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const LevelIncrease = async (req, res) => {
  try {
    const { studentId, level } = req.body;

    if (!studentId || level === undefined) {
      return res.status(400).json({ message: "studentId and level are required" });
    }

    // Find student and update level
    const student = await Student.findByIdAndUpdate(
      studentId,
      { level: level },
      { new: true } // return updated doc
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Level updated successfully",
      level: student.level,
    });
  } catch (error) {
    console.error("Error updating level:", error);
    res.status(500).json({ message: "Server error" });
  }
};


 export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and GIF images are allowed"), false);
    }
  },
});

export const createClan = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { clanName, desc } = req.body;

    if (!clanName || !desc || !req.file) {
      return res.status(400).json({
        success: false,
        message: "ClanName, description, and avatar are required",
      });
    }

    // Upload avatar to Cloudinary
    const cloudinaryResult = await uploadOnCloudinary(req.file.buffer, {
      folder: "clan-avatars",
      transformation: [
        { width: 500, crop: "limit" },
        { quality: "auto" },
      ],
    });

    if (!cloudinaryResult?.url) {
      throw new Error("Failed to upload avatar to Cloudinary");
    }

    // Generate random clanCode
    const clanCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create clan
    const newClan = new Clan({
      clanName,
      desc,
      avatar: {
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
      },
      leader: playerId,
      members: [playerId], // leader auto-added as member
      clanCode,
    });

    await newClan.save();

    res.status(201).json({
      success: true,
      message: "Clan created successfully",
      clan: newClan,
    });
  } catch (error) {
    console.error("Create Clan error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


export const getClanData = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Find the clan where this student is the leader
    const clan = await Clan.findOne({ leader: studentId })
      .populate("leader", "name email") // optional: populate leader info
      .populate("ClanMember", "name email"); // optional: populate members info

    if (!clan) {
      return res
        .status(404)
        .json({ message: "No clan found where this student is leader" });
    }

    res.status(200).json({
      message: "Clan data fetched successfully",
      clan,
    });
  } catch (error) {
    console.error("Error fetching clan data:", error);
    res.status(500).json({
      message: "Server error while fetching clan data",
      error: error.message,
    });
  }
};

export const AddinClanBYclanCode = async (req, res) => {
  try {
    const { clanCode, studentId } = req.body;

    if (!clanCode || !studentId) {
      return res.status(400).json({ message: "clanCode and studentId required" });
    }

    // Find the clan by code
    const clan = await Clan.findOne({ clanCode });

    if (!clan) {
      return res.status(404).json({ message: "Clan not found with this code" });
    }

    // Check if student is already in members
    if (clan.ClanMember.includes(studentId)) {
      return res.status(400).json({ message: "Student already in clan" });
    }

    // Add student to clan members
    clan.ClanMember.push(studentId);
    await clan.save();

    res.status(200).json({
      message: "Student added to clan successfully",
      clan,
    });
  } catch (error) {
    console.error("Error adding student to clan:", error);
    res.status(500).json({
      message: "Server error while adding student to clan",
      error: error.message,
    });
  }
};


export const getIntroductionData = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    // find student
    const student = await Student.findById(studentId).select("progress");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // progress might be object or array, handle both cases
    let introductionValue = 0;
    if (Array.isArray(student.progress) && student.progress.length > 0) {
      introductionValue = student.progress[0].introduction;
    } else if (student.progress?.introduction !== undefined) {
      introductionValue = student.progress.introduction;
    }

    res.json({
      studentId: student._id,
      introduction: introductionValue,
    });
  } catch (error) {
    console.error("Error fetching introduction progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getNaturalData = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    // find student
    const student = await Student.findById(studentId).select("progress");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get conservation value
    let conservationValue = 0;
    if (Array.isArray(student.progress) && student.progress.length > 0) {
      conservationValue = student.progress[0].conservation ?? 0;
    } else if (student.progress?.conservation !== undefined) {
      conservationValue = student.progress.conservation;
    }

    res.json({
      studentId: student._id,
      conservation: conservationValue,
    });
  } catch (error) {
    console.error("Error fetching conservation progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getProgressData = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    // find student
    const student = await Student.findById(studentId).select("progress");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // If progress is object, return as is
    let progressData = {};
    if (Array.isArray(student.progress) && student.progress.length > 0) {
      progressData = student.progress[0]; // case: stored as array
    } else {
      progressData = student.progress || {}; // case: stored as object
    }

    res.json({
      studentId: student._id,
      progress: {
        introduction: progressData.introduction ?? 0,
        conservation: progressData.conservation ?? 0,
        pollution: progressData.pollution ?? 0,
        climate: progressData.climate ?? 0,
        sustainable: progressData.sustainable ?? 0,
        biodiversity: progressData.biodiversity ?? 0,
        environment: progressData.environment ?? 0,
        real_world: progressData.real_world ?? 0,
      },
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getquizedata = async (req, res) => {
  try {
    const { studentId } = req.params; // ✅ get studentId from params
    const { playerXp } = req.body; // ✅ get xp from request body

    if (!playerXp || playerXp <= 0) {
      return res.status(400).json({ message: "XP must be a positive number" });
    }

    // ✅ Find student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Increase quiz XP and overall XP
    student.Quize += playerXp;
    student.playerXp += playerXp;

    // ✅ Save updated student
    await student.save();

    res.status(200).json({
      message: "Quiz XP added successfully",
      updatedStudent: student,
    });
  } catch (error) {
    console.error("Error updating quiz data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
