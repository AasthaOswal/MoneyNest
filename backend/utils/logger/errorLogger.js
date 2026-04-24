import ErrorLog from "../models/errorLog.model.js";

export const createErrorLog = async (req, error, extra = {}) => {
  try {
    await ErrorLog.create({
      message: error.message,
      stack: error.stack,
      method: req?.method,
      url: req?.originalUrl,
      ip: req?.ip,
      user: req?.user?._id,
      requestBody: req?.body || {},
      query: req?.query || {},
      headers: req?.headers || {},
      ...extra,
    });
  } catch (logError) {
    console.error("ErrorLog write failed:", logError.message);
  }
};