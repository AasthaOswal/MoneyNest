import mongoose from "mongoose";

const rateLimitLogSchema = new mongoose.Schema(
  {
    limiterName: {
      type: String,
      required: true,
      trim: true,
    },

    identifierType: {
      type: String,
      enum: ["user", "ip"],
      required: true,
    },

    identifier: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    ip: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    method: {
      type: String,
      default: "UNKNOWN",
      trim: true,
    },

    path: {
      type: String,
      default: "UNKNOWN",
      trim: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    statusCode: {
      type: Number,
      default: 429,
    },

    userAgent: {
      type: String,
      default: "",
      trim: true,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

rateLimitLogSchema.index({ identifier: 1, createdAt: -1 });
rateLimitLogSchema.index({ limiterName: 1, createdAt: -1 });

const RateLimitLog = mongoose.model("RateLimitLog", rateLimitLogSchema);

export default RateLimitLog;