import Notification from "../../models/notification.model.js";
import { createFailedOperation } from "../failedOperation/failedOperationCreator.js";
import { getIO } from "../../config/socket.js";
export const createNotification = async ({
  userId,
  title,
  body,
  type = "notification",
  data = {},
  familyId = null,
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

    const io = getIO();


    if (familyId) {
      io.to(`family:${familyId}`).emit("notification", {
        notification,
      });
    } else {
      io.to(`user:${userId}`).emit("notification", {
        notification,
      });
    }


    return notification;

  } catch (error) {
    console.error("Error creating notification:", error.message);

    throw error;
  }
};