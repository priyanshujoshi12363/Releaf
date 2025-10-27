import { Student } from "../models/Student.model.js";
import multer from "multer";
import { uploadOnCloudinary } from "./../utils/cloudinary.js"; // Your Cloudinary helper
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'


// Multer config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and GIF images are allowed"), false);
    }
  },
});

// ✅ Register & Initialize Player
export const Register = async (req, res) => {
  try {
    const { PlayerName, email, password, PhoneNO } = req.body;

    // 1️⃣ Required fields check
    if (!PlayerName || !email || !password || !PhoneNO) {
      return res.status(400).json({
        msg: "All fields are required",
        missing: {
          Avatar: !req.file,
          email: !email,
          PlayerName: !PlayerName,
          PhoneNO: !PhoneNO,
          password: !password,
        },
      });
    }

    // 2️⃣ Avatar check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Avatar image is required",
      });
    }

    // 3️⃣ Check for duplicate email
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 4️⃣ Upload Avatar to Cloudinary
    const cloudinaryResult = await uploadOnCloudinary(req.file.buffer, {
      folder: "player-avatars",
      transformation: [
        { width: 500, crop: "limit" },
        { quality: "auto" },
      ],
    });

    if (!cloudinaryResult?.url) {
      throw new Error("Failed to upload avatar to Cloudinary");
    }

    // 5️⃣ Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    // 6️⃣ Create new Student with default player values
    const newUser = new Student({
      PlayerName,
      email,
      password: hashedPwd,
      PhoneNO,
      Avatar: {
        url: cloudinaryResult.url,
        public_id: cloudinaryResult.public_id,
      },
      // 🎮 Player defaults
      playerXp: 10,   // bonus XP for joining
      Level: 1,
      streak: 1,
      Quize: 0,
      EcoLearn: 0,
      GamePoint: 0,
    });

    await newUser.save();

    // 7️⃣ Response
    return res.status(201).json({
      success: true,
      message: "User registered & initialized successfully",
      user: newUser,
    });

  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const generateToken = (userId) => {
    return JWT.sign(
        { userId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Case-insensitive email lookup
    const user = await Student.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        PlayerName: user.PlayerName,
        PhoneNO: user.PhoneNO,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
