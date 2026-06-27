// utils/failedOperation/createFailedOperation.js
import FailedOperation from "../../models/admin/failedOperation.model.js";

export const createFailedOperation = async ({
  operationType,
  payload = {},
  error,
  maxRetries = 3,
}) => {
  try {
    
    console.log("inside  failed operation creation function")
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
    
    console.log("inside  failed operation creation function - after failed operation is created for: ", operationType, "-", payload );
    
  } catch (err) {
    console.error("Failed to log failed operation:", err.message);
  }
};