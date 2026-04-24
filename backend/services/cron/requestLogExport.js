import cron from "node-cron";
import FailedOperation from "../models/failedOperation.model.js";
import { exportRequestLogsAndEmail } from "../services/requestLogExport.service.js";

export const startRequestLogExportCron = () => {
  cron.schedule("0 0 * * 0", async () => {
    try {
      await exportRequestLogsAndEmail();
    } catch (error) {
      console.error("Request log export cron failed:", error.message);

      await FailedOperation.create({
        operationType: "cron_job",
        status: "failed",
        payload: {
          task: "weekly_request_export",
        },
        error: {
          message: error.message,
          stack: error.stack,
        },
        nextRetryAt: new Date(Date.now() + 60 * 60 * 1000),
      });
    }
  });
};