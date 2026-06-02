import mongoose from "mongoose";

/*
Note sshow all these details onceadmin clicks on the single request
when showing all requests together - hide them its fine
userAgent
origin
referer
ip
requestId
*/

const requestLogSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userEmail: {
      type: String,
    },

    userRole: {
      type: String,
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


    responseSizeKb: {
      type: Number,
      default: 0,
    },

    browser: String,
    browserVersion: String,

    os: String,
    osVersion: String,

    deviceType: {
      type: String,
      default: "desktop",
    },

    origin: String,

    originType: {
      type: String,
      enum: ["localhost", "production"],
    },

    referer: String,


  },
  { timestamps: true }
);

// Indexes (VERY IMPORTANT)
requestLogSchema.index({ createdAt: -1 });
requestLogSchema.index({ statusCode: 1, createdAt: -1 });
requestLogSchema.index({ userId: 1, createdAt: -1 });
requestLogSchema.index({ path: 1, createdAt: -1 });



export default mongoose.model("RequestLog", requestLogSchema);