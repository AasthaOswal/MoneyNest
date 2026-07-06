// utils/goals/formatGoalSummary.js

import { escape } from "querystring";

const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const getGoalStatusMessage = ({ goal, progress, }) => {
    const progressPercent = Number(progress.progress).toFixed(2);

    // Goal hasn't started
    if (!progress.hasStarted) {
        return `⏳ "${goal.title}" hasn't started yet. It will begin on ${new Date(
            goal.startDate
        ).toLocaleDateString("en-IN")}.`;
    }

    // Goal period ended
    if (progress.hasEnded) {
        if (goal.goalType === "target") {
            if (progress.status === "completed") {
                return `🎉 You successfully achieved "${goal.title}" by reaching ${formatCurrency(
                    progress.currentAmount
                )}.`;
            }

            return `📅 "${goal.title}" has ended. You reached ${progressPercent}% of your target.`;
        }

        // Limit goal
        if (progress.hasExceededLimit) {
            return `⚠️ "${goal.title}" ended and exceeded the limit by ${formatCurrency(
                progress.exceededAmount
            )}.`;
        }

        return `✅ "${goal.title}" ended while staying within the limit.`;
    }

    // ===== TARGET GOALS =====

    if (goal.goalType === "target") {
        if (progress.status === "completed") {
            return `🎉 Congratulations! "${goal.title}" has been completed.`;
        }

        if (progressPercent >= 90) {
            return `🔥 You're almost there! "${goal.title}" is ${progressPercent}% complete.`;
        }

        if (progressPercent >= 75) {
            return `💪 Great progress! "${goal.title}" is ${progressPercent}% complete.`;
        }

        if (progressPercent >= 50) {
            return `👍 "${goal.title}" is halfway there (${progressPercent}%).`;
        }

        return `📈 "${goal.title}" is ${progressPercent}% complete. Keep going!`;
    }

    // ===== LIMIT GOALS =====

    if (progress.hasExceededLimit) {
        return `🚨 "${goal.title}" exceeded its limit by ${formatCurrency(
            progress.exceededAmount
        )}.`;
    }

    if (progressPercent >= 90) {
        return `⚠️ Careful! "${goal.title}" has used ${progressPercent}% of its limit.`;
    }

    if (progressPercent >= 75) {
        return `👀 "${goal.title}" has used ${progressPercent}% of its allowed limit.`;
    }

    if (progressPercent >= 50) {
        return `👍 "${goal.title}" has used ${progressPercent}% of its limit.`;
    }

    return `✅ "${goal.title}" is well within its limit (${progressPercent}% used).`;
};

export const formatGoalSummary = ({ goal, progress, getOnlyMessage=false  }) => {
    const progressPercent = Number(progress.progress).toFixed(2);

    const message = getGoalStatusMessage({ goal, progress });


    const remainingLabel = goal.goalType === "limit" ? "Remaining Limit" : "Remaining Target";

    const notificationBody = [
        message,
        "",
        `📊 Progress: ${progressPercent}%`,
        `💰 Current: ${formatCurrency(progress.currentAmount)}`,
        `🎯 Target: ${formatCurrency(progress.targetAmount)}`,
        `📌 ${remainingLabel}: ${formatCurrency(progress.remainingAmount)}`,
        progress.hasExceededLimit
            ? `🚨 Exceeded By: ${formatCurrency(progress.exceededAmount)}`
            : null,
        `📍 Status: ${progress.status}`,
    ]
    .filter(Boolean)
    .join("\n");

    const emailHtml = `


        <div style="margin-bottom:24px;">
            <h3>${goal.title}</h3>

            <p>
                <strong>Goal Type:</strong> ${goal.goalType}<br/>
                <strong>Transaction Type:</strong> ${goal.type}<br/>
                <strong>Progress:</strong> ${progressPercent}%<br/>
                <strong>Current:</strong> ${formatCurrency(
                    progress.currentAmount
                )}<br/>
                <strong>Target:</strong> ${formatCurrency(
                    progress.targetAmount
                )}<br/>
                ${
                    goal.goalType === "limit"
                        ? `<strong>Remaining Limit:</strong> ${formatCurrency(
                              progress.remainingAmount
                          )}<br/>`
                        : `<strong>Remaining Target:</strong> ${formatCurrency(
                              progress.remainingAmount
                          )}<br/>`
                }

                ${
                    progress.hasExceededLimit
                        ? `<strong>Exceeded By:</strong> ${formatCurrency(
                              progress.exceededAmount
                          )}<br/>`
                        : ""
                }

                <strong>Status:</strong> ${progress.status}
            </p>

            <p style="color:#2563eb;">
                ${message}
            </p>
        </div>

    `;

    if(getOnlyMessage === false){

        return {
            emailHtml,
            notificationTitle: "Personal Goal Update",
            notificationBody,
            goalMessage: {
                goalId: goal._id,
                title: goal.title,
                message,
            },
        }

    }else{
        return {
            message
        }
    }

    
};