import Notification from "../../models/notification.model.js";

export const createNotification = async ({
  userId,
  title,
  body,
  type = "system",
  data = {},
}) => {
  try {
    console.log("inside notiifcaiton creator")
    const notification = await Notification.create({
      user: userId,
      title,
      body,
      type,
      data,
    });

    return notification;

  } catch (error) {
    console.error("Error creating notification:", error.message);
    return null; // don't break cron
  }
};