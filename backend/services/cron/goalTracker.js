
import cron from "node-cron";
import Goal from "../../models/goal.model.js";
import Transaction from "../../models/transaction.model.js";
import { getDateRange } from "../../utils/goals/getDateRange.js";
import { sendPushNotification } from "../firebase/sendPushNotification.js";

// Solve N+1 problem cause by this for loop later on

// Solve this problem too later on -- problem is two executions happening at the same time

// In production-
// const GOAL_TRACKER_CRON = process.env.NODE_ENV === "development" ? "* * * * *" : "0 */12 * * *";


// Just for testing -
const GOAL_TRACKER_CRON = "* * * * *";

export const startGoalTracker = () => {
    let isRunning = false;
    cron.schedule(GOAL_TRACKER_CRON, async () => {

        if (isRunning) return;
        isRunning = true;

        try {
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
                        const title = `🚨 Goal Alert for : ${goal.title}`;
                        const body = `${goal.title} reached ${level}%`;

                        if (goal.scope === "family") {
                            // TODO: send to all family members
                            console.log("Send to family members");
                            
                            const users = await User.find({ family: goal.family });

                            for (const user of users) {
                                await sendPushNotification(user._id, title, body);
                            }
                        } else {
                            await sendPushNotification(goal.user, title, body);
                        }

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
  
        } catch (error) {
            console.log("Error in goal tracker:", error);
        } finally {
            isRunning = false;
        }
        
    });
};