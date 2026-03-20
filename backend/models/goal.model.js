import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null // null = family-level goal
  },

  // 🎯 What this goal applies to
  targetType: {
    type: String,
    enum: ["overall", "category", "label"],
    default: "overall"
  },

  // If targetType = category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },

  // If targetType = label
  label: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Label",
    default: null
  },

  type: {
    type: String,
    enum: ["expense-limit", "income-target", "investment-target"]
  },

  amount: {
    type: Number,
    required: true
  },

  period: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"]
  },

  startDate: Date,
  endDate: Date,

  // For alerts like 50%, 80%
  alertThresholds: [Number] // e.g. [50, 80, 100] ---> so alert will go at 50% 80% so on

}, { timestamps: true });

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;