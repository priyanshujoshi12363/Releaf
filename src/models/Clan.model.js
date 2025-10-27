import mongoose from "mongoose";

const ClanSchema = new mongoose.Schema({
  leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // assuming Student = player model
      required: true,
    },
  clanName:{
    type:String,
    required:true
  },
  clanLevel:{
    type:Number,
    default:0
  },
     avatar: {  // Change from String to Object
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },
  desc:{
    type:String,
    required:true
  },
  ClanMember:[{
    PlayerName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    },
    ClanQuize:{
      type:Number
    }
  }],
    clanCode: {
    type: String,
    unique: true,
    default: () => Math.random().toString(36).substring(2, 8).toUpperCase(), // auto-generate clan code
  },
    clanXP: {
    type: Number,
    default: 0,
  },
})

export const Clan = mongoose.model("Clan" , ClanSchema)