import cron from "node-cron";

import User from "../../../models/user.model.js";
import Goal from "../../../models/goal.model.js";
import calculateGoalProgress from "../../goals/calculateGoalProgress.js";

import { executeRetryable } from "../../../utils/retryable/executeRetryable.js";
import { sendEmailBrevoNoAttachments } from "../../../utils/email/sendEmailBrevo.js";
import { createNotification } from "../../../utils/notification/createNotification.js";

import { formatGoalSummary } from "../../goals/formatGoalSummary.js";

// runs every 5 minutes - deployed testing
const PERSONAL_GOAL_TRACKER_CRON = "*/5 * * * *";

// runs every minute - localhost testing
// const PERSONAL_GOAL_TRACKER_CRON = "* * * * *";

// Every Sunday at 6:00 PM
// const PERSONAL_GOAL_TRACKER_CRON = "0 18 * * 0";

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

                        if (goal.status !== progress.status) {

                            goal.status = progress.status;

                            await goal.save();

                        }


                        const formattedGoal = formatGoalSummary({
                            goal,
                            progress,
                        });

                        goalSummaries.push(formattedGoal);
                    }

                    console.log(`\nUser: ${user.email}`);
                    console.log(goalSummaries);

                    // ===========================================
                    // SEND ONE EMAIL TO THIS USER
                    // Include all personal goal summaries
                    // ===========================================

                    const emailHtml = `
                        <h1>Personal Goals Update</h1>
                        <p>Here's the latest progress on all your personal financial goals.</p>
                        <hr/>
                        ${goalSummaries.map((goal) => goal.emailHtml).join("<br/>")}
                        <hr/>
                        <p>Keep tracking your finances and stay on top of your goals.</p>
                    `;

                    await executeRetryable({
                        operationType: "email",

                        payload: {
                            toEmail: user.email,
                            subject: "Personal Goals Weekly Update",
                            htmlContent: emailHtml,
                        },

                        operation: () =>
                            sendEmailBrevoNoAttachments({
                                toEmail: user.email,
                                subject: "Personal Goals Weekly Update",
                                htmlContent: emailHtml,
                            }),
                    });

                    // ===========================================
                    // CREATE ONE DATABASE NOTIFICATION
                    // ===========================================

                    const notificationBody = goalSummaries
                    .map((goal) => `• ${goal.notificationBody}`)
                    .join("\n");

                    await executeRetryable({
                        operationType: "db_notification",

                        payload: {
                            userId: user._id,
                            title: "Personal Goal Update",
                            body: notificationBody,
                            type: "goal_update",

                        },

                        operation: () =>
                            createNotification({
                                userId: user._id,
                                title: "Personal Goal Update",
                                body: notificationBody,
                                type: "goal_update",

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