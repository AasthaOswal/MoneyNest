import cron from "node-cron";
import FailedOperation from "../../models/admin/failedOperation.model.js";
import { exportRequestLogsAndEmail } from "../../services/admin/requestLogExport.service.js";

const CRON_TESTING = "* * * * *";

const CRON_PRODUCTION = "0 0 * * 0"

export const startRequestLogExportCron = () => {
  cron.schedule(CRON_TESTING, async () => {
    console.log("Inside request  log export")
    try {
      await exportRequestLogsAndEmail();
    } catch (error) {
      console.error("Request log export cron failed:", error.message);

      await FailedOperation.create({
        operationType: "request_log_export",
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