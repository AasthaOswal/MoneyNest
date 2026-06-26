import cron from "node-cron";
import FailedOperation from "../../models/admin/failedOperation.model.js";
import { retrySingleOperation } from "../retry/retrySingleFailedOperation.service.js";

// const RETRY_CRON = "* * * * *"; // every minute


const RETRY_CRON = "*/30 * * * * *"; // every 30 sec

export const startFailedOperationsRetryNew = () => {
    console.log("🔁 Failed Operations Retry Service Started");

    cron.schedule(
        RETRY_CRON,
        async () => {
            console.log("⏰ Retry Cron Running:", new Date().toISOString());

            try {
                const operations = await FailedOperation.find({
                    status: "failed",
                    retryCount: { $lte: 3 }, // keep cron limited; admin retry can ignore maxRetries
                    nextRetryAt: { $lte: new Date() },
                })
                    .sort({ createdAt: 1 })
                    .limit(10);

                for (const op of operations) {
                    try {
                        console.log(`🔄 Retrying: ${op.operationType}`, op._id);

                        const result = await retrySingleOperation(op, {
                            ignoreMaxRetries: false,
                        });

                        if (result.success) {
                            console.log(`✅ Resolved: ${op._id}`);
                        } else {
                            console.warn(`⚠️ Retry failed for ${op._id}:`, result.message);
                        }
                    } catch (retryError) {
                        console.error(`❌ Retry failed for ${op._id}`, retryError.message);
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