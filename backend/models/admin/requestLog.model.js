import mongoose from "mongoose";

const requestLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    method: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    statusCode: {
      type: Number,
      required: true,
    },

    responseTime: {
      type: Number,
      default: 0,
    },

    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

requestLogSchema.index({ createdAt: -1 });
requestLogSchema.index({ statusCode: 1, createdAt: -1 });

export default mongoose.model("RequestLog", requestLogSchema);