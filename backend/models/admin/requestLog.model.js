import mongoose from "mongoose";

const requestLogSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    method: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    statusCode: {
      type: Number,
      required: true,
    },

    responseTimeMs: {
      type: Number,
      required: true,
    },

    ip: String,
    userAgent: String,

    actorType: {
      type: String,
      enum: ["anonymous", "authenticated"],
      default: "anonymous",
    },

    query: Object,
    body: Object,
    headers: Object,
  },
  { timestamps: true }
);

// 🔍 Indexes (VERY IMPORTANT)
requestLogSchema.index({ createdAt: -1 });
requestLogSchema.index({ statusCode: 1, createdAt: -1 });
requestLogSchema.index({ user: 1, createdAt: -1 });
requestLogSchema.index({ path: 1, createdAt: -1 });



export default mongoose.model("RequestLog", requestLogSchema);