import mongoose from "mongoose";

const errorLogSchema = new mongoose.Schema(
  {
    errorName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    requestId: {
      type: String,
    },

    stack: String,

    method: String,
    path: String,
    ip: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low"
    },

    environment: {
      type: String,
      enum: ["development", "production"],
      default: "production"
    },


  },
  { timestamps: true }
);

errorLogSchema.index({ createdAt: -1 });
errorLogSchema.index({ path: 1, createdAt: -1 });

export default mongoose.model("ErrorLog", errorLogSchema);