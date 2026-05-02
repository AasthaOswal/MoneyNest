
// import cron from "node-cron";
// import Goal from "../../models/goal.model.js";
// import User from "../../models/user.model.js";
// import Transaction from "../../models/transaction.model.js";
// import { getDateRange } from "../../utils/goals/getDateRange.js";
// import { sendPushNotification } from "../firebase/sendPushNotification.js";
// import { createNotification } from "../../utils/notification/createNotification.js";


// // Solve N+1 problem cause by this for loop later on

// // Solve this problem too later on -- problem is two executions happening at the same time

// // In production-
// // const GOAL_TRACKER_CRON = process.env.NODE_ENV === "development" ? "* * * * *" : "0 */12 * * *";


// // Just for testing -
// const GOAL_TRACKER_CRON = "* * * * *";



// // const GOAL_TRACKER_CRON = "0 */12 * * *";

// export const startGoalTracker = () => {
//     let isRunning = false;
//     cron.schedule(GOAL_TRACKER_CRON, async () => {

//         if (isRunning) return;
//         isRunning = true;

//         console.log("⏰ Cron Triggered at:", new Date().toISOString());

//         try {
//             console.log("Running Goal Tracker...");

//             const goals = await Goal.find({
//                 status: "active",
//                 goalMode: "recurring",
//             });

//             console.log("Goals : " ,goals, "\n\n");

//             for (const goal of goals) {
//                 const { start, end } = getDateRange(goal.period);

//                 goal.triggeredAlerts = goal.triggeredAlerts.filter(
//                     (a) => a.lastTriggeredAt >= start && a.lastTriggeredAt <= end
//                 );

//                 const matchStage = {
//                     type: goal.type,
//                     createdAt: { $gte: start, $lte: end },
//                 };

//                 if (goal.scope === "family") {
//                     matchStage.family = goal.family;
//                 } else {
//                     matchStage.user = goal.user;
//                 }

//                 console.log("Date Range:", start, end);
//                 console.log("Match Stage:", matchStage);

//                 const result = await Transaction.aggregate([
//                     { $match: matchStage },
//                     {
//                         $group: {
//                         _id: null,
//                         total: { $sum: "$amount" },
//                         },
//                     },
//                 ]);

//                 console.log("Aggregation result:", result);

//                 const currentAmount = result[0]?.total || 0;
//                 const percentage = (currentAmount / goal.amount) * 100;

//                 console.log("Current Amount:", currentAmount);
//                 console.log("Goal Amount:", goal.amount);
//                 console.log("Percentage:", percentage);

//                 const alertLevels = [50, 70, 100];

//                 for (const level of alertLevels) {
//                     const alreadyTriggered = goal.triggeredAlerts.some((a) => {
//                     return (
//                         a.percentage === level &&
//                         a.lastTriggeredAt >= start &&
//                         a.lastTriggeredAt <= end
//                     );
//                     });

//                     if (percentage >= level && !alreadyTriggered) {
//                         const title = `🚨 Goal Alert for : ${goal.title}`;
//                         const body = `${goal.title} reached ${level}%`;

//                         if (goal.scope === "family") {
//                             // TODO: send to all family members
//                             console.log("Send to family members");
                            
//                             const users = await User.find({ family: goal.family });

//                             for (const user of users) {
//                                 await sendPushNotification(user._id, title, body);
//                                 await createNotification({
//                                     userId: user._id,
//                                     title,
//                                     body,
//                                     type: "goal_alert",
//                                     data: "goalzzz"
//                                 });
//                             }
//                         } else {
//                             await sendPushNotification(goal.user, title, body);
//                             await createNotification({
//                                 userId: goal.user,
//                                 title,
//                                 body,
//                                 type: "goal_alert",
//                                 data: "goalzzz"
//                             });
//                         }

//                         goal.triggeredAlerts.push({
//                             percentage: level,
//                             lastTriggeredAt: new Date(),
//                         });
//                     }
//                 }

//                 if (percentage >= 100 && goal.goalType === "target") {
//                     goal.status = "completed";
//                 }

//                 await goal.save();
//             }
  
//         } catch (error) {
//             console.log("Error in goal tracker:", error);
//         } finally {
//             isRunning = false;
//         }
        
//     }, {
//         timezone: "Asia/Kolkata"
//     });
// };







//----------------------------------------------Version 2------------------------------------------------------------

// import cron from "node-cron";
// import Goal from "../../models/goal.model.js";
// import User from "../../models/user.model.js";
// import Transaction from "../../models/transaction.model.js";
// import { getDateRange } from "../../utils/goals/getDateRange.js";
// import { sendPushNotification } from "../firebase/sendPushNotification.js";
// import { createNotification } from "../../utils/notification/createNotification.js";

// // Just for testing
// const GOAL_TRACKER_CRON = "* * * * *";

// export const startGoalTracker = () => {
//   let isRunning = false;

//   cron.schedule(
//     GOAL_TRACKER_CRON,
//     async () => {
//       if (isRunning) return;
//       isRunning = true;

//       console.log("⏰ Cron Triggered at:", new Date().toISOString());

//       try {
//         console.log("Running Goal Tracker...");

//         const goals = await Goal.find({
//           status: "active",
//           goalMode: "recurring",
//         });

//         for (const goal of goals) {
//           const { start, end } = getDateRange(goal.period);

//           const matchStage = {
//             type: goal.type,
//             createdAt: { $gte: start, $lte: end },
//           };

//           if (goal.scope === "family") {
//             matchStage.family = goal.family;
//           } else {
//             matchStage.user = goal.user;
//           }

//           console.log("Date Range:", start, end);
//           console.log("Match Stage:", matchStage);

//           const result = await Transaction.aggregate([
//             { $match: matchStage },
//             {
//               $group: {
//                 _id: null,
//                 total: { $sum: "$amount" },
//               },
//             },
//           ]);

//           const currentAmount = result[0]?.total || 0;
//           const percentage = (currentAmount / goal.amount) * 100;

//           console.log("Current Amount:", currentAmount);
//           console.log("Goal Amount:", goal.amount);
//           console.log("Percentage:", percentage);

//           const now = new Date();

//         //   ⛔ skip if notified in last 1 hour
//         //   if (
//         //     goal.lastNotifiedAt &&
//         //     now - goal.lastNotifiedAt < 60 * 60 * 1000
//         //   ) {
//         //     continue;
//         //   }

//           // ⛔ skip if notified in last 2 minutes (testing)
//           if (
//             goal.lastNotifiedAt &&
//             now - goal.lastNotifiedAt < 2 * 60 * 1000
//           ) {
//             continue;
//           }

//           // ✅ SINGLE NOTIFICATION LOGIC
//           const title = `📊 Goal Update: ${goal.title}`;
//           const body = `You’ve reached ₹${currentAmount} (${percentage.toFixed(
//             1
//           )}%) of your goal`;

//           if (goal.scope === "family") {
//             const users = await User.find({ family: goal.family });

//             for (const user of users) {
//               await sendPushNotification(user._id, title, body);

//               await createNotification({
//                 userId: user._id,
//                 title,
//                 body,
//                 type: "goal_alert",
//                 data: "goalzzz",
//               });
//             }
//           } else {
//             await sendPushNotification(goal.user, title, body);

//             await createNotification({
//               userId: goal.user,
//               title,
//               body,
//               type: "goal_alert",
//               data: "goalzz"
//             });
//           }

//           // Optional: auto-complete target goals
//           if (percentage >= 100 && goal.goalType === "target") {
//             goal.status = "completed";
//           }
//           goal.lastNotifiedAt = now;

//           await goal.save();
//         }
//       } catch (error) {
//         console.log("Error in goal tracker:", error);
//       } finally {
//         isRunning = false;
//       }
//     },
//     {
//       timezone: "Asia/Kolkata",
//     }
//   );
// };











//-------------------------------version 3--------------------------------


// import cron from "node-cron";
// import Goal from "../../models/goal.model.js";
// import User from "../../models/user.model.js";
// import Transaction from "../../models/transaction.model.js";
// import { getDateRange } from "../../utils/goals/getDateRange.js";
// import { sendPushNotification } from "../firebase/sendPushNotification.js";
// import { createNotification } from "../../utils/notification/createNotification.js";

// // Just for testing
// const GOAL_TRACKER_CRON = "* * * * *";

// export const startGoalTracker = () => {
//   let isRunning = false;

//   cron.schedule(
//     GOAL_TRACKER_CRON,
//     async () => {
//       if (isRunning) return;
//       isRunning = true;

//       console.log("⏰ Cron Triggered at:", new Date().toISOString());

//       try {
//         console.log("Running Goal Tracker...");

//         const goals = await Goal.find({
//           status: "active",
//           goalMode: "recurring",
//         });

//         const now = new Date();

//         // 🔥 USER-WISE SUMMARY MAP
//         const userSummaryMap = new Map();

//         for (const goal of goals) {
//           // ⛔ Skip if recently notified
//           if (
//             goal.lastNotifiedAt &&
//             now - goal.lastNotifiedAt < 2 * 60 * 1000
//           ) {
//             continue;
//           }

//           const { start, end } = getDateRange(goal.period);

//           const matchStage = {
//             type: goal.type,
//             createdAt: { $gte: start, $lte: end },
//           };

//           if (goal.scope === "family") {
//             matchStage.family = goal.family;
//           } else {
//             matchStage.user = goal.user;
//           }

//           const result = await Transaction.aggregate([
//             { $match: matchStage },
//             {
//               $group: {
//                 _id: null,
//                 total: { $sum: "$amount" },
//               },
//             },
//           ]);

//           const currentAmount = result[0]?.total || 0;
//           const percentage = (currentAmount / goal.amount) * 100;

//           // 🎯 CATEGORY COUNTS
//           let category = "normal";
//           if (percentage >= 100) category = "exceeded";
//           else if (percentage >= 80) category = "nearing";
//           else if (percentage < 50) category = "attention";

//           // 👇 DETERMINE USERS (family vs individual)
//           let users = [];

//           if (goal.scope === "family") {
//             users = await User.find({ family: goal.family }, "_id");
//           } else {
//             users = [{ _id: goal.user }];
//           }

//           // 🔥 ADD TO USER SUMMARY
//           for (const user of users) {
//             const userId = user._id.toString();

//             if (!userSummaryMap.has(userId)) {
//               userSummaryMap.set(userId, {
//                 totalGoals: 0,
//                 nearing: 0,
//                 exceeded: 0,
//                 attention: 0,
//               });
//             }

//             const summary = userSummaryMap.get(userId);

//             summary.totalGoals++;

//             if (category === "exceeded") summary.exceeded++;
//             else if (category === "nearing") summary.nearing++;
//             else if (category === "attention") summary.attention++;
//           }

//           // ✅ Update goal status
//           if (percentage >= 100 && goal.goalType === "target") {
//             goal.status = "completed";
//           }

//           goal.lastNotifiedAt = now;
//           await goal.save();
//         }

//         // 🚀 SEND ONE NOTIFICATION PER USER
//         for (const [userId, summary] of userSummaryMap.entries()) {
//           const title = "📊 Update on your Goals Progress";

//           const body = `${summary.totalGoals} goals found
// • ${summary.nearing} nearing target
// • ${summary.exceeded} exceeded
// • ${summary.attention} need attention

// 👉 Tap to view dashboard`;

//           await sendPushNotification(userId, title, body);

//           await createNotification({
//             userId,
//             title,
//             body,
//             type: "goal_alert",
//             data: "goalzzz",
//           });
//         }
//       } catch (error) {
//         console.log("Error in goal tracker:", error);
//       } finally {
//         isRunning = false;
//       }
//     },
//     {
//       timezone: "Asia/Kolkata",
//     }
//   );
// };









//------------------------version4 -----------------------------


// import cron from "node-cron";
// import Goal from "../../models/goal.model.js";
// import User from "../../models/user.model.js";
// import Transaction from "../../models/transaction.model.js";
// import { getDateRange } from "../../utils/goals/getDateRange.js";
// import { sendPushNotification } from "../firebase/sendPushNotification.js";
// import { createNotification } from "../../utils/notification/createNotification.js";

// // Just for testing
// const GOAL_TRACKER_CRON = "* * * * *";

// const getGoalWindow = (goal) => {
//   if (goal.goalMode === "recurring") {
//     return getDateRange(goal.period);
//   }

//   return {
//     start: goal.startDate,
//     end: goal.endDate,
//   };
// };

// const getGoalBucket = (goalType, percentage) => {
//   if (goalType === "target") {
//     if (percentage >= 100) return { bucket: "achieved", label: "Achieved" };
//     if (percentage >= 80) return { bucket: "warning", label: "Nearing target" };
//     if (percentage >= 50) return { bucket: "onTrack", label: "On track" };
//     return { bucket: "attention", label: "Needs attention" };
//   }

//   if (goalType === "limit") {
//     if (percentage >= 100) return { bucket: "critical", label: "Overspent" };
//     if (percentage >= 80) return { bucket: "warning", label: "Approaching limit" };
//     return { bucket: "onTrack", label: "Within limit" };
//   }

//   return { bucket: "onTrack", label: "On track" };
// };

// const getRecipientIds = async (goal, familyUsersCache) => {
//   if (goal.scope === "individual") {
//     return [goal.user.toString()];
//   }

//   if (goal.visibility === "family") {
//     const familyId = goal.family.toString();

//     if (!familyUsersCache.has(familyId)) {
//       const familyUsers = await User.find({ family: goal.family }, "_id").lean();
//       const ids = [...new Set(familyUsers.map((u) => u._id.toString()))];
//       familyUsersCache.set(familyId, ids);
//     }

//     return familyUsersCache.get(familyId);
//   }

//   // private family goal → only creator gets notified
//   return [goal.createdBy.toString()];
// };

// export const startGoalTracker = () => {
//   let isRunning = false;

//   cron.schedule(
//     GOAL_TRACKER_CRON,
//     async () => {
//       if (isRunning) return;
//       isRunning = true;

//       console.log("⏰ Cron Triggered at:", new Date().toISOString());

//       try {
//         console.log("Running Goal Tracker...");

//         // include both recurring and custom
//         const goals = await Goal.find({
//           status: "active",
//         });

//         const now = new Date();
//         const familyUsersCache = new Map();

//         // userId -> summary
//         const userSummaryMap = new Map();

//         for (const goal of goals) {
//           const { start, end } = getGoalWindow(goal);

//           // custom goals should not be evaluated before they start
//           if (goal.goalMode === "custom" && now < new Date(start)) {
//             continue;
//           }

//           if (!start || !end) continue;

//           const matchStage = {
//             type: goal.type,
//             createdAt: { $gte: new Date(start), $lte: new Date(end) },
//           };

//           if (goal.scope === "family") {
//             matchStage.family = goal.family;
//           } else {
//             matchStage.user = goal.user;
//           }

//           const result = await Transaction.aggregate([
//             { $match: matchStage },
//             {
//               $group: {
//                 _id: null,
//                 total: { $sum: "$amount" },
//               },
//             },
//           ]);

//           const currentAmount = result[0]?.total || 0;
//           const percentage = goal.amount > 0 ? (currentAmount / goal.amount) * 100 : 0;

//           const { bucket } = getGoalBucket(goal.goalType, percentage);

//           const recipientIds = await getRecipientIds(goal, familyUsersCache);

//           for (const userId of recipientIds) {
//             if (!userSummaryMap.has(userId)) {
//               userSummaryMap.set(userId, {
//                 goalIds: new Set(),
//                 totalGoals: 0,
//                 achieved: 0,
//                 onTrack: 0,
//                 warning: 0,
//                 attention: 0,
//                 critical: 0,
//               });
//             }

//             const summary = userSummaryMap.get(userId);
//             const goalId = goal._id.toString();

//             // prevent duplicate counting for the same user-goal pair
//             if (summary.goalIds.has(goalId)) {
//               continue;
//             }

//             summary.goalIds.add(goalId);
//             summary.totalGoals += 1;
//             summary[bucket] += 1;
//           }

//           // Status updates:
//           // recurring goals stay active
//           // custom goals can be completed/failed when the window ends or threshold is crossed
//           if (goal.goalMode === "custom") {
//             const windowEnded = now > new Date(end);

//             if (goal.goalType === "target") {
//               if (percentage >= 100) {
//                 goal.status = "completed";
//               } else if (windowEnded) {
//                 goal.status = "failed";
//               }
//             }

//             if (goal.goalType === "limit") {
//               if (percentage >= 100) {
//                 goal.status = "failed";
//               } else if (windowEnded) {
//                 goal.status = "completed";
//               }
//             }
//           }

//           await goal.save();
//         }

//         // send one notification per user
//         for (const [userId, summary] of userSummaryMap.entries()) {
//           const actionableCount =
//             summary.achieved +
//             summary.warning +
//             summary.attention +
//             summary.critical;

//           // skip quiet summaries that are only "on track"
//           if (actionableCount === 0) continue;

//           const title = "📊 Update on your Goals Progress";

//           const lines = [`${summary.totalGoals} goals checked`];

//           if (summary.achieved) lines.push(`• ${summary.achieved} achieved`);
//           if (summary.onTrack) lines.push(`• ${summary.onTrack} on track`);
//           if (summary.warning) lines.push(`• ${summary.warning} nearing / warning`);
//           if (summary.attention) lines.push(`• ${summary.attention} need attention`);
//           if (summary.critical) lines.push(`• ${summary.critical} overspent`);

//           const body = `${lines.join("\n")}\n\n👉 Tap to view dashboard`;

//           await sendPushNotification(userId, title, body);

//           await createNotification({
//             userId,
//             title,
//             body,
//             type: "goal_alert",
//             data: "goalzzz",
//           });
//         }
//       } catch (error) {
//         console.log("Error in goal tracker:", error);
//       } finally {
//         isRunning = false;
//       }
//     },
//     {
//       timezone: "Asia/Kolkata",
//     }
//   );
// };






//-------------------------------version 5----------------------------

import cron from "node-cron";
import Goal from "../../models/goal.model.js";
import Transaction from "../../models/transaction.model.js";
import User from "../../models/user.model.js";
import { getDateRange } from "../../utils/goals/getDateRange.js";
import { sendPushNotification } from "../firebase/sendPushNotification.js";
import { createNotification } from "../../utils/notification/createNotification.js";

const GOAL_TRACKER_CRON = "* * * * *";

const getGoalBucket = (goalType, percentage) => {
  if (goalType === "target") {
    if (percentage >= 100) return "achieved";
    if (percentage >= 80) return "warning";
    if (percentage >= 50) return "onTrack";
    return "attention";
  }

  if (goalType === "limit") {
    if (percentage >= 100) return "critical";
    if (percentage >= 80) return "warning";
    return "onTrack";
  }

  return "onTrack";
};

export const startGoalTracker = () => {
  let isRunning = false;

  cron.schedule(GOAL_TRACKER_CRON, async () => {
    if (isRunning) return;
    isRunning = true;

    try {
      console.log("Inside goal tracker cron job");
      const goals = await Goal.find({ status: "active" }).lean();

      const grouped = new Map();

      // 🔥 STEP 1: GROUP GOALS
      for (const goal of goals) {
        const key = `${goal.family}_${goal.type}_${goal.period}`;

        if (!grouped.has(key)) {
          grouped.set(key, []);
        }

        grouped.get(key).push(goal);
      }

      const userSummaryMap = new Map();
      const familyUsersCache = new Map();

      // 🔥 STEP 2: ONE AGGREGATION PER GROUP
      for (const [key, groupGoals] of grouped.entries()) {
        const { family, type, period } = groupGoals[0];

        const { start, end } = getDateRange(period);

        const result = await Transaction.aggregate([
          {
            $match: {
              family,
              type,
              date: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" }
            }
          }
        ]);

        const total = result[0]?.total || 0;

        console.log(total, result)

        // 🔥 STEP 3: APPLY RESULT TO ALL GOALS
        for (const goal of groupGoals) {
          const percentage =
            goal.amount > 0 ? (total / goal.amount) * 100 : 0;

          const bucket = getGoalBucket(goal.goalType, percentage);

          // get family users (cached)
          const familyId = goal.family.toString();

          if (!familyUsersCache.has(familyId)) {
            const users = await User.find({ familyId: goal.family }, "_id").lean();
            familyUsersCache.set(
              familyId,
              users.map((u) => u._id.toString())
            );
          }

          const recipients = familyUsersCache.get(familyId);

          for (const userId of recipients) {
            if (!userSummaryMap.has(userId)) {
              userSummaryMap.set(userId, {
                totalGoals: 0,
                achieved: 0,
                onTrack: 0,
                warning: 0,
                attention: 0,
                critical: 0
              });
            }

            const summary = userSummaryMap.get(userId);

            summary.totalGoals += 1;
            summary[bucket] += 1;
          }
        }
      }

      console.log(userSummaryMap)

      // 🔥 STEP 4: SEND ONE NOTIFICATION PER USER
      for (const [userId, summary] of userSummaryMap.entries()) {
        const actionable =
          summary.achieved +
          summary.warning +
          summary.attention +
          summary.critical;

          console.log(actionable, userId)

        if (actionable === 0) continue;

        const lines = [`${summary.totalGoals} goals checked`];

        if (summary.achieved) lines.push(`• ${summary.achieved} achieved`);
        if (summary.warning) lines.push(`• ${summary.warning} warning`);
        if (summary.attention) lines.push(`• ${summary.attention} attention`);
        if (summary.critical) lines.push(`• ${summary.critical} overspent`);

        const body = `${lines.join("\n")}\n\n👉 Tap to view dashboard`;

        await sendPushNotification(userId, "📊 Goals Update", body);

        await createNotification({
          userId,
          title: "📊 Goals Update",
          body,
          type: "goal_alert"
        });
      }

    } catch (err) {
      console.log("Goal tracker error:", err);
    } finally {
      isRunning = false;
    }
  }, { timezone: "Asia/Kolkata" });
};