import mongoose from "mongoose";

const errorLogSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    stack: String,

    method: String,
    url: String,
    ip: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    requestBody: {
      type: Object,
      default: {},
    },

    query: {
      type: Object,
      default: {},
    },

    headers: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

errorLogSchema.index({ createdAt: -1 });
errorLogSchema.index({ url: 1, createdAt: -1 });

export default mongoose.model("ErrorLog", errorLogSchema);