// services/goalTracker.service.js

import cron from "node-cron";
import Goal from "../../models/goal.model.js";
import Transaction from "../../models/transaction.model.js";
import { getDateRange } from "../../utils/goals/getDateRange.js";
// import { sendPushNotification } from "../../utils/firebase/pushNotification.js";

// Solve N+1 problem cause by this for loop later on

// Solve this problem too later on -- problem is two executions happening at the same time


const GOAL_TRACKER_CRON =
  process.env.NODE_ENV === "development" ? "* * * * *" : "*/10 * * * *";

export const startGoalTracker = () => {
    cron.schedule(GOAL_TRACKER_CRON, async () => {
        console.log("Running Goal Tracker...");

        const goals = await Goal.find({
            status: "active",
            goalMode: "recurring",
        });

        console.log("Goals : " ,goals, "\n\n");

        for (const goal of goals) {
            const { start, end } = getDateRange(goal.period);

            goal.triggeredAlerts = goal.triggeredAlerts.filter(
                (a) => a.lastTriggeredAt >= start && a.lastTriggeredAt <= end
            );

            const matchStage = {
                type: goal.type,
                createdAt: { $gte: start, $lte: end },
            };

            if (goal.scope === "family") {
                matchStage.family = goal.family;
            } else {
                matchStage.user = goal.user;
            }

            console.log("Date Range:", start, end);
            console.log("Match Stage:", matchStage);

            const result = await Transaction.aggregate([
                { $match: matchStage },
                {
                    $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                    },
                },
            ]);

        console.log("Aggregation result:", result);

        const currentAmount = result[0]?.total || 0;
        const percentage = (currentAmount / goal.amount) * 100;

        console.log("Current Amount:", currentAmount);
        console.log("Goal Amount:", goal.amount);
        console.log("Percentage:", percentage);

        const alertLevels = [50, 70, 100];

        for (const level of alertLevels) {
            const alreadyTriggered = goal.triggeredAlerts.some((a) => {
            return (
                a.percentage === level &&
                a.lastTriggeredAt >= start &&
                a.lastTriggeredAt <= end
            );
            });

            if (percentage >= level && !alreadyTriggered) {
                // await sendPushNotification(goal, level);
                console.log("-----------Simulating push notification-------------");
                console.log("Goal: ", goal.title);
                console.log("Level: ", level);
                console.log("Percentage: ", percentage);
                console.log("Already Triggered: ", alreadyTriggered);
                console.log("-------------------------------------");

                goal.triggeredAlerts.push({
                    percentage: level,
                    lastTriggeredAt: new Date(),
                });
            }
        }

        if (percentage >= 100 && goal.goalType === "target") {
            goal.status = "completed";
        }

        await goal.save();
        }
    });
};