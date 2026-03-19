import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family"
  },

  message: String,

  type: {
    type: String,
    enum: ["daily-entry", "goal-alert"]
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
