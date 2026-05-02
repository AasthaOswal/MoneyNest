// utils/errorLogger.js

import ErrorLog from "../../models/admin/errorLog.model.js";

export const errorLogger = async ({
  error,
  req = null,
  severity = "low",
  requestId = null,
}) => {
  try {
    const allowedSeverities = ["low", "medium", "high", "critical"];

    const safeSeverity = allowedSeverities.includes(severity)
      ? severity
      : "low";
      
    await ErrorLog.create({
      errorName: error.name || "Error",
      message: error.message || "Unknown error",
      stack: error.stack,

      requestId: requestId || req?.requestId,

      method: req?.method,
      path: req?.originalUrl || req?.path,
      ip: req?.ip,

      userId: req?.user?._id || null,

      severity: safeSeverity,
      environment: process.env.NODE_ENV || "development",
    });
  } catch (logErr) {
    console.error("❌ Failed to log error:", logErr.message);
  }
};