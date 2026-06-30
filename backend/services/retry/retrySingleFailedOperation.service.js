import { operationHandlers } from "./operationHandler.js";

export const retrySingleOperation = async (operation, options = {}) => {
  const { ignoreMaxRetries = false, resetRetryCount = false } = options;

  const handler = operationHandlers[operation.operationType];

  if (!handler) {
    throw new Error("Unknown operation type");
  }

  try {
    // ✅ Reset logic BEFORE retry (admin case)
    if (resetRetryCount) {
      operation.retryCount = 0;
      operation.nextRetryAt = new Date();
    }

    await handler(operation.payload);

    operation.status = "resolved";
    operation.lastRetriedAt = new Date();

    await operation.save();

    console.log(`resolved operation: ${operation.operationType} - ${operation._id}`)

    return {
      success: true,
      message: "Operation retried successfully",
    };

  } catch (error) {
    operation.retryCount += 1;
    operation.lastRetriedAt = new Date();

    // const delay = Math.pow(2, operation.retryCount) * 60 * 1000;
    const delay = 30 * 1000; // 30 seconds --for testing
    operation.nextRetryAt = new Date(Date.now() + delay);

    if (!ignoreMaxRetries && operation.retryCount >= operation.maxRetries) {
      operation.status = "failed";
    }

    await operation.save();

    return {
      success: false,
      message: error.message,
    };
  }
};