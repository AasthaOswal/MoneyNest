import Notification from "../../models/notification.model.js";
import { createFailedOperation } from "../failedOperation/failedOperationCreator.js";
export const createNotification = async ({
  userId,
  title,
  body,
  type = "notification",
  data = {}
}) => {
  try {
    console.log("inside notiifcaiton creator")
    // throw new Error("Test error from createNotification");
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
    await createFailedOperation({
      operationType: "db_notification",
      payload: {
        userId,
        title,
        body,
        type,
        data
      },
      error,
    });
    return null; // don't break cron
  }
};