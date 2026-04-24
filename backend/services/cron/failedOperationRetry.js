import cron from "node-cron";
import { retryFailedOperations } from "../services/failedOperation.service.js";

export const startFailedOperationRetryCron = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      await retryFailedOperations();
    } catch (error) {
      console.error("Failed operation retry cron error:", error.message);
    }
  });
};