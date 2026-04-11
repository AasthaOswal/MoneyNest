import cron from "node-cron";
import Goal from "../models/goal.model.js";
import Transaction from "../models/transaction.model.js";
import { getDateRange } from "../utils/getDateRange.js";
import { sendPushNotification } from "../utils/firebase.js";

cron.schedule("*/10 * * * *", async () => {
    console.log("Running Goal Tracker...");

    const goals = await Goal.find({ status: "active", goalMode: "recurring" });

    for (const goal of goals) {
        const { start, end } = getDateRange(goal.period);

        const result = await Transaction.aggregate([
            {
                $match: {
                    family: goal.family,
                    type: goal.type,
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const currentAmount = result[0]?.total || 0;
        const percentage = (currentAmount / goal.amount) * 100;

        // ALERT LOGIC
        const alertLevels = [50, 70, 100];

        for (const level of alertLevels) {
            const alreadyTriggered = goal.triggeredAlerts.some(a => a.percentage === level);

            if (percentage >= level && !alreadyTriggered) {

                // 🔥 SEND NOTIFICATION
                await sendPushNotification(goal, level);

                goal.triggeredAlerts.push({
                    percentage: level,
                    lastTriggeredAt: new Date()
                });
            }
        }

        // mark completed
        if (percentage >= 100 && goal.goalType === "target") {
            goal.status = "completed";
        }

        await goal.save();
    }
});