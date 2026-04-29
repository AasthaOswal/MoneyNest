import mongoose from "mongoose";

const blockedEntitySchema = new mongoose.Schema(
  {
    identifierType: {
      type: String,
      enum: ["user", "ip"],
      required: true,
      index: true,
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

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    blockedUntil: {
      type: Date,
      default: null,
      index: true,
    },

    isPermanent: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    triggerCount: {
      type: Number,
      default: 0,
    },

    lastTriggeredAt: {
      type: Date,
      default: null,
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

blockedEntitySchema.index({ identifierType: 1, identifier: 1 }, { unique: true });
blockedEntitySchema.index({ active: 1, blockedUntil: 1 });

const BlockedEntity = mongoose.model("BlockedEntity", blockedEntitySchema);

export default BlockedEntity;