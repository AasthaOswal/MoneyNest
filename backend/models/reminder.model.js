import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  message: String,

  type: {
    type: String,
    enum: ["daily-entry", "goal-alert"]
  },

  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal",
    default: null
  },

  triggerTime: Date,

  isRecurring: Boolean,

  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"]
  }

}, { timestamps: true });

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;