import mongoose from "mongoose";

const blockedEntitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["ip", "user"],
      required: true,
    },

    value: {
      type: String, // IP string OR userId (stringified)
      required: true,
      index: true,
    },

    reason: {
      type: String,
      default: "Suspicious activity",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

blockedEntitySchema.index({ type: 1, value: 1 });

export default mongoose.model("BlockedEntity", blockedEntitySchema);