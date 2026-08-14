import mongoose from "mongoose";

export const PROGRESS_TOPICS = [
  "introduction",
  "conservation",
  "pollution",
  "climate",
  "sustainable",
  "biodiversity",
  "environment",
  "real_world",
];

const progressDefaults = () =>
  Object.fromEntries(PROGRESS_TOPICS.map((topic) => [topic, 0]));

const ProgressSchema = new mongoose.Schema(
  Object.fromEntries(
    PROGRESS_TOPICS.map((topic) => [topic, { type: Number, default: 0, min: 0 }])
  ),
  { _id: false }
);

const StudentSchema = new mongoose.Schema(
  {
    Avatar: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    PlayerName: {
      type: String,
      required: [true, "Player name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],

      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],

      select: false,
    },
    PhoneNO: { type: String, required: true, trim: true },

    playerXp: { type: Number, default: 0, min: 0 },
    Level: { type: Number, default: 1, min: 1 },
    streak: { type: Number, default: 0, min: 0 },

    EcoLearn: { type: Number, default: 0, min: 0 },
    Quize: { type: Number, default: 0, min: 0 },
    GamePoint: { type: Number, default: 0, min: 0 },

    clan: { type: mongoose.Schema.Types.ObjectId, ref: "Clan", default: null },

    achievements: { type: [String], default: [] },
    inventory: { type: [String], default: [] },

    progress: { type: ProgressSchema, default: progressDefaults },
  },
  { timestamps: true }
);

StudentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export const Student = mongoose.model("Student", StudentSchema);
