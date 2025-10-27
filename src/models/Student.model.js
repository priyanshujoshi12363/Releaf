import mongoose from 'mongoose'

const StudentSchema = new mongoose.Schema({
    Avatar: {  // Change from String to Object
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },
   PlayerName:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   password:{
    type:String,
    required:true
   },
   PhoneNO:{
    type:String,
    required:true
   },
   playerXp:{
    type:Number,
    default:0
   },
   Level:{
    type:Number,
    default:0
   },
   ClanName:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Clan"
   },
   ClanLevel:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Clan"
   },
   ClanQuize:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Clan'
   },
   EcoLearn:{
     type:Number,
     default:0,
      
   },
   Quize:{
      type:Number,
      default:0
   },
   GamePoint:{
     type:Number,
     default:0
   },
  streak: { type: Number, default: 0 },
  achievements: {
    type: [String],
    default: []
  },
  inventory: {
    type: [String], // badges, items
    default: []
  },
    progress: {
    introduction: { type: Number, default: 0 },
    conservation: { type: Number, default: 0 },
    pollution: { type: Number, default: 0 },
    climate: { type: Number, default: 0 },
    sustainable: { type: Number, default: 0 },
    biodiversity: { type: Number, default: 0 },
    environment: { type: Number, default: 0 },
    real_world: { type: Number, default: 0 },
  },
})

export const Student = mongoose.model("Student" , StudentSchema)