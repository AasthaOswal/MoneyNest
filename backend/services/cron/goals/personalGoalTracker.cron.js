import cron from "node-cron";

import User from "../../../models/user.model.js";
import Goal from "../../../models/goal.model.js";
import calculateGoalProgress from "../../goals/calculateGoalProgress.js";

import { executeRetryable } from "../../../utils/retryable/executeRetryable.js";
import { sendEmailBrevoNoAttachments } from "../../../utils/email/sendEmailBrevo.js";
import { createNotification } from "../../../utils/notification/createNotification.js";

// runs every 3 minutes - deployed testing
// const PERSONAL_GOAL_TRACKER_CRON = "*/3 * * * *";

// runs every minute - localhost testing
const PERSONAL_GOAL_TRACKER_CRON = "* * * * *";

// every day at 9:00 AM
// const PERSONAL_GOAL_TRACKER_CRON = "0 9 * * *";

export const startPersonalGoalTracker = () => {
    cron.schedule(
        PERSONAL_GOAL_TRACKER_CRON,
        async () => {
            console.log(
                "\n========================================\nPersonal Goal Tracker Started\n========================================\n"
            );

            try {
                const users = await User.find();

                for (const user of users) {
                    const goals = await Goal.find({
                        createdBy: user._id,
                        visibility: "personal",
                        status: "active",
                    });

                    if (goals.length === 0) {
                        continue;
                    }

                    const goalSummaries = [];

                    for (const goal of goals) {
                        const progress = await calculateGoalProgress(goal);

                        goalSummaries.push({
                            goal,
                            progress,
                        });
                    }

                    console.log(`\nUser: ${user.email}`);
                    console.log(goalSummaries);

                    // ===========================================
                    // SEND ONE EMAIL TO THIS USER
                    // Include all personal goal summaries
                    // ===========================================

                    // ===========================================
                    // CREATE ONE DATABASE NOTIFICATION
                    // ===========================================

                            await executeRetryable({
                                operationType: "db_notification",
                                payload: {
                                    userId: user._id,
                                    title: "Weekly Goals Update",
                                    body: `Your  goal summary: ${goalSummaries}`,
                                    type: "goal_update",
                                    data: {
                                            goalSummaries
                                        },
                                },
                    
                                operation: () =>
                                    createNotification({
                                        userId: user._id,
                                        title: "Weekly Goals Update",
                                        body: `Your  goal summary: ${goalSummaries}`,
                                        type: "goal_update",
                                        data: {
                                            goalSummaries
                                        },
                                    }),
                            });
                    
                    
                            await executeRetryable({
                                operationType: "email",
                    
                                payload: {
                                    toEmail: user.email,
                                    subject: "Weekly Goal Update",
                                    htmlContent: `
                                        <p>Here is your goal summary: ${goalSummaries}</p>
                                    `,
                                },
                    
                                operation: () =>
                                    sendEmailBrevoNoAttachments({
                                        toEmail: user.email,
                                        subject: "Weekly Goal Update",
                                        htmlContent: `
                                            <p>Here is your goal summary: ${goalSummaries}</p>
                                        `,
                                    }),
                            });
                }

                console.log(
                    "\nPersonal Goal Tracker Completed\n"
                );
            } catch (error) {
                console.error(
                    "Personal Goal Tracker Failed"
                );
                console.error(error);
            }
        },
        {
            timezone: "Asia/Kolkata",
        }
    );

    console.log("Personal Goal Tracker Registered");
};