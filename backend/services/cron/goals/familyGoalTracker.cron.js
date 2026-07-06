import cron from "node-cron";

import Family from "../../../models/family.model.js";
import User from "../../../models/user.model.js";
import Goal from "../../../models/goal.model.js";
import calculateGoalProgress from "../../goals/calculateGoalProgress.js";

import { executeRetryable } from "../../../utils/retryable/executeRetryable.js";
import { sendEmailBrevoNoAttachments } from "../../../utils/email/sendEmailBrevo.js";
import { createNotification } from "../../../utils/notification/createNotification.js";

// runs every 5 minutes - deployed testing
const FAMILY_GOAL_TRACKER_CRON = "*/5 * * * *";

// runs every minute - localhost testing
// const FAMILY_GOAL_TRACKER_CRON = "* * * * *";

// every day at 9:00 AM
// const FAMILY_GOAL_TRACKER_CRON = "0 9 * * *";

export const startFamilyGoalTracker = () => {
    cron.schedule(
        FAMILY_GOAL_TRACKER_CRON,
        async () => {
            console.log(
                "\n========================================\nFamily Goal Tracker Started\n========================================\n"
            );

            try {

                /*
                    CHANGE:
                    We only fetch active families.

                    Earlier this cron assumed that the Family document contained
                    a members array.

                    However, in our schema, the relationship is the opposite:
                    User -> familyId

                    Therefore, we first fetch all families.
                */
                const families = await Family.find({
                    status: "active",
                });

                console.log("Families found: ", families);

                const familyIds = families.map(family => family._id);

                /*
                    CHANGE:
                    Fetch ALL active users belonging to ANY family in a single query.

                    This avoids executing one User.find() for every family.

                    Without this:
                        1 query for families
                        + 1 query per family for members

                    With this:
                        1 query for families
                        + 1 query for all users

                    This avoids the N+1 query problem and scales much better.
                */
                const users = await User.find({
                    familyId: { $in: familyIds },
                    status: "active",
                    isActive: true,
                });

                console.log("Users found: ", users);

                /*
                    CHANGE:
                    Group users by familyId in memory.

                    Map Structure:

                    {
                        familyId1 => [user1, user2, user3],
                        familyId2 => [user4, user5],
                        ...
                    }

                    Looking up members for a family now becomes O(1).
                */
                const usersByFamily = new Map();

                for (const user of users) {
                    const familyId = user.familyId.toString();

                    if (!usersByFamily.has(familyId)) {
                        usersByFamily.set(familyId, []);
                    }

                    usersByFamily.get(familyId).push(user);
                }

                for (const family of families) {

                    /*
                        CHANGE:
                        Instead of querying the database again, simply retrieve
                        the already-grouped users from memory.
                    */
                    const members =
                        usersByFamily.get(family._id.toString()) || [];

                    const goals = await Goal.find({
                        family: family._id,
                        visibility: "family",
                        status: "active",
                    });

                    if (goals.length === 0) {
                        continue;
                    }

                    const goalSummaries = [];

                    for (const goal of goals) {
                        const progress =
                            await calculateGoalProgress(goal);

                        goalSummaries.push({
                            goal,
                            progress,
                        });
                    }

                    console.log(`\nFamily: ${family.familyName}`);
                    console.log(goalSummaries);

                    for (const user of members) {

                        // ===========================================
                        // SEND ONE EMAIL TO THIS FAMILY MEMBER
                        // Include all family goal summaries
                        // ===========================================

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
                    }
                }

                console.log(
                    "\nFamily Goal Tracker Completed\n"
                );
            } catch (error) {
                console.error(
                    "Family Goal Tracker Failed"
                );
                console.error(error);
            }
        },
        {
            timezone: "Asia/Kolkata",
        }
    );

    console.log("Family Goal Tracker Registered");
};