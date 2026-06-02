import mongoose from "mongoose";

const errorLogSchema = new mongoose.Schema({
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


errorFingerprint: {
	type: String,
	required: true,
	unique: true,
},

occurrenceCount: {
	type: Number,
	default: 1,
},

firstOccurredAt: {
	type: Date,
	default: Date.now,
},

lastOccurredAt: {
	type: Date,
	default: Date.now,
},

isResolved: {
	type: Boolean,
	default: false,
},

resolvedAt: Date,

resolvedBy: {
	type: mongoose.Schema.Types.ObjectId,
	ref: "User",
},
resolutionHistory: [
  {
    resolvedAt: {
      type: Date,
      required: true,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
],


},{ timestamps: true });

errorLogSchema.index({ createdAt: -1 });
errorLogSchema.index({ path: 1, createdAt: -1 });

export default mongoose.model("ErrorLog", errorLogSchema);