import cron from "node-cron";
import FailedOperation from "../../models/admin/failedOperation.model.js";

import { createNotification } from "../../utils/notification/createNotification.js";

// ✅ ADD THESE
import { deleteFromCloudinary } from "../../utils/cloudinary/deleteFromCloudinary.js";



import {sendEmailBrevo} from "../../utils/email/sendEmailBrevo.js";


// 🔥 Handler Mapping
const operationHandlers = {



  db_notification: async (payload) => {
    const { userId, title, body, type, data } = payload;
    await createNotification({ userId, title, body, type, data });
  },

  // ✅ NEW
  cloudinary_delete: async (payload) => {
    const { publicId } = payload;
    await deleteFromCloudinary(publicId);
  },




};

const RETRY_CRON = "* * * * *"; // every minute

export const startFailedOperationsRetry = () => {
  console.log("🔁 Failed Operations Retry Service Started");

  cron.schedule(
    RETRY_CRON,
    async () => {
      console.log("⏰ Retry Cron Running:", new Date().toISOString());

      try {
        const operations = await FailedOperation.find({
          status: "failed",
          retryCount: { $lt: 3 },
          nextRetryAt: { $lte: new Date() },
        }).limit(10);

        for (const op of operations) {
          try {
            console.log(`🔄 Retrying: ${op.operationType}`, op._id);

            const handler = operationHandlers[op.operationType];

            if (!handler) {
              console.log(op)
              console.warn("⚠️ Unknown operationType:", op.operationType);
              continue;
            }

            // ✅ CALL EXISTING FUNCTION
            await handler(op.payload);

            // ✅ SUCCESS
            op.status = "resolved";
            op.lastRetriedAt = new Date();
            await op.save();

            console.log(`✅ Resolved: ${op._id}`);

          } catch (retryError) {
            console.error(`❌ Retry failed for ${op._id}`, retryError.message);

            op.retryCount += 1;
            op.lastRetriedAt = new Date();

            // ⏳ exponential backoff
            const delay = Math.pow(2, op.retryCount) * 60 * 1000;
            op.nextRetryAt = new Date(Date.now() + delay);

            if (op.retryCount >= op.maxRetries) {
              op.status = "failed";
            }

            await op.save();
          }
        }

      } catch (err) {
        console.error("❌ Retry Cron Error:", err.message);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};