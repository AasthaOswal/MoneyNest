// utils/errorLogger.js

import ErrorLog from "../../models/admin/errorLog.model.js";

export const errorLogger = async ({
  error,
  req = null,
  severity = "low",
  requestId = null,
}) => {
  try {
    await ErrorLog.create({
      errorName: error.name || "Error",
      message: error.message || "Unknown error",
      stack: error.stack,

      requestId: requestId || req?.requestId,

      method: req?.method,
      path: req?.originalUrl || req?.path,
      ip: req?.ip,

      userId: req?.user?.id || null,

      severity: severity || "low",
      environment: process.env.NODE_ENV || "development",
    });
  } catch (logErr) {
    console.error("❌ Failed to log error:", logErr.message);
  }
};