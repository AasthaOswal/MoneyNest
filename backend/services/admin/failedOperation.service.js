import FailedOperation from "../../models/admin/failedOperation.model.js";
import { exportRequestLogsAndEmail } from "./requestLogExport.service.js";
import cloudinary from "../../config/cloudinary.js";
// Plug your notification sender here if you already have one.
// import { sendNotification } from "./notification.service.js";

let autoRetryEnabled = true;

export const getAutoRetryStatus = () => autoRetryEnabled;

export const setAutoRetryStatus = (value) => {
  autoRetryEnabled = Boolean(value);
  return autoRetryEnabled;
};

export const toggleAutoRetryStatus = () => {
  autoRetryEnabled = !autoRetryEnabled;
  return autoRetryEnabled;
};

export const executeOperation = async (op) => {
  switch (op.operationType) {
    case "cloudinary_delete": {
      const publicId = op.payload?.publicId;
      if (!publicId) throw new Error("Missing publicId for cloudinary_delete");
      await cloudinary.uploader.destroy(publicId);
      return;
    }

    case "notification": {
      // Replace this with your actual notification retry logic.
      // Example:
      // await sendNotification(op.payload);
      throw new Error("Notification retry handler not wired yet");
    }

    case "cron_job": {
      const task = op.payload?.task;

      if (task === "weekly_request_export") {
        await exportRequestLogsAndEmail();
        return;
      }

      throw new Error(`Unknown cron job task: ${task}`);
    }

    default:
      throw new Error("Unknown operation type");
  }
};

export const retryFailedOperations = async () => {
  if (!autoRetryEnabled) return;

  const ops = await FailedOperation.find({
    status: "failed",
    retryCount: { $lt: 3 },
    $or: [
      { nextRetryAt: { $exists: false } },
      { nextRetryAt: null },
      { nextRetryAt: { $lte: new Date() } },
    ],
  }).sort({ createdAt: 1 });

  for (const op of ops) {
    try {
      await executeOperation(op);

      op.status = "resolved";
      op.lastRetriedAt = new Date();
      op.retryCount += 1;
      op.error = undefined;
      op.nextRetryAt = null;
    } catch (err) {
      op.retryCount += 1;
      op.lastRetriedAt = new Date();
      op.error = {
        message: err.message,
        stack: err.stack,
      };
      op.nextRetryAt = new Date(Date.now() + 60 * 60 * 1000); // retry after 1 hour
    }

    await op.save();
  }
};