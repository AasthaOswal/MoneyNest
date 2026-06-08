// utils/failedOperation/createFailedOperation.js
import FailedOperation from "../../models/admin/failedOperation.model.js";

export const createFailedOperation = async ({
  operationType,
  payload = {},
  error,
  maxRetries = 3,
}) => {
  try {
    await FailedOperation.create({
      operationType,
      payload,
      error: {
        message: error?.message || "Unknown error",
        stack: error?.stack || "",
      },
      retryCount: 0,
      maxRetries,
      nextRetryAt: new Date(),
      status: "failed",
    });
  } catch (err) {
    console.error("Failed to log failed operation:", err.message);
  }
};