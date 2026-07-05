import mongoose from "mongoose";



const goalSchema = new mongoose.Schema({

  title: { type: String, required: true },

  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  type: {
    type: String,
    enum: ["income", "expense", "investment", "preInvestmentSavings" ,"netSavings"],
    required: true
  },

  goalType: {
    type: String,
    enum: ["target", "limit"],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["active", "completed", "failed"],
    default: "active"
  },

  visibility: {
    type: String,
    enum: ["family", "personal"],
    default: "family"
  },

  startDate:{
    type:Date,
    required:true,
  },

  endDate:{
    type:Date,
    required:true,
  },

  lastNotifiedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
