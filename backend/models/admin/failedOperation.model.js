import mongoose from "mongoose";

const failedOperationSchema = new mongoose.Schema(
  {
    operationType: {
      type: String,
      enum: ["cloudinary_delete", "cron_job", "notification"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "failed", "resolved"],
      default: "failed",
    },

    payload: {
      type: Object,
      default: {},
    },

    error: {
      message: String,
      stack: String,
    },

    retryCount: {
      type: Number,
      default: 0,
    },

    maxRetries: {
      type: Number,
      default: 3,
    },

    nextRetryAt: {
      type: Date,
      default: Date.now,
    },

    lastRetriedAt: Date,
  },
  { timestamps: true }
);

failedOperationSchema.index({ status: 1, nextRetryAt: 1 });
failedOperationSchema.index({ operationType: 1, status: 1 });

export default mongoose.model("FailedOperation", failedOperationSchema);