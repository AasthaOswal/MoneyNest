import admin from "firebase-admin";

export const sendPushNotification = async (goal, level) => {
    const message = {
        notification: {
            title: "Goal Update 🚀",
            body: `${goal.title} reached ${level}%`
        },
        topic: goal.family.toString() // or user-specific token
    };

    try {
        await admin.messaging().send(message);
    } catch (err) {
        console.log("Notification error:", err.message);
    }
};