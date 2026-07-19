import mongoose from "mongoose";

const failedOperationSchema = new mongoose.Schema(
  {

    requestId: {
      type: String,
    },
    operationType: {
      type: String,
      enum: ["cloudinary_delete","cloudinary_delete_multiple", "monthly_report_email", "db_notification", "request_log_export", "ai_monthly_report_email"],
      required: true,
    },

    status: {
      type: String,
      enum: ["retrying", "failed", "resolved"],
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