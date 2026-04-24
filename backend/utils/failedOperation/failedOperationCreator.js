import FailedOperation from "../../models/FailedOperation.model.js";

export const createFailedOperation = async ({
  operationType,
  payload,
  error
}) => {
  await FailedOperation.create({
    operationType,
    payload,
    error: {
      message: error.message,
      stack: error.stack
    },
    nextRetryAt: new Date(Date.now() + 10 * 60 * 1000)
  });
};