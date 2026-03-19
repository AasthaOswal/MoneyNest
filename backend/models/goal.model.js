import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null // null = family goal
  },

  type: {
    type: String,
    enum: ["expense-limit", "income-target"]
  },

  amount: Number,

  period: {
    type: String,
    enum: ["monthly", "yearly"]
  },

  startDate: Date,
  endDate: Date
}, { timestamps: true });

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
