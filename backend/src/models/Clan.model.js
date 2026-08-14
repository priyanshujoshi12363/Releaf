import mongoose from "mongoose";
import crypto from "node:crypto";

export const generateClanCode = () =>
  crypto.randomBytes(4).toString("hex").slice(0, 6).toUpperCase();

const ClanMemberSchema = new mongoose.Schema(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    clanQuize: { type: Number, default: 0, min: 0 },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ClanSchema = new mongoose.Schema(
  {
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    clanName: { type: String, required: true, trim: true, minlength: 3, maxlength: 40 },
    desc: { type: String, required: true, trim: true, maxlength: 300 },
    avatar: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    clanLevel: { type: Number, default: 1, min: 1 },
    clanXP: { type: Number, default: 0, min: 0 },
    ClanMember: { type: [ClanMemberSchema], default: [] },
    clanCode: {
      type: String,
      unique: true,
      index: true,
      uppercase: true,
      default: generateClanCode,
    },
  },
  { timestamps: true }
);

ClanSchema.statics.MAX_MEMBERS = 50;

ClanSchema.methods.hasMember = function hasMember(studentId) {
  return this.ClanMember.some((member) => String(member.player) === String(studentId));
};

export const Clan = mongoose.model("Clan", ClanSchema);
