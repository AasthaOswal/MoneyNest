// utils/failedOperation/createFailedOperation.js

import FailedOperation from "../../models/admin/failedOperation.model.js";

export const createFailedOperation = async ({
  operationType,
  payload,
  error,
}) => {
  try {
    await FailedOperation.create({
      operationType,
      payload,
      error: {
        message: error?.message || "Unknown error",
        stack: error?.stack || "",
      },
      status: "failed",
      retryCount: 0,
      nextRetryAt: new Date(), // retry ASAP
    });
  } catch (err) {
    console.error("❌ Failed to log FailedOperation:", err);
  }
};