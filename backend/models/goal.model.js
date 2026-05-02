import mongoose from "mongoose";



const goalSchema = new mongoose.Schema({

  title: { type: String, required: true },

  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  type: {
    type: String,
    enum: ["income", "expense", "investment", "saving"],
    required: true
  },

  goalType: {
    type: String,
    enum: ["target", "limit"],
    required: true
  },

  period: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
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

  lastNotifiedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
