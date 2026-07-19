import { createNotification } from "../../utils/notification/createNotification.js";
import { deleteFromCloudinary } from "../../utils/cloudinary/deleteFromCloudinary.js";
import { sendEmailBrevo } from "../../utils/email/sendEmailBrevo.js";
import {generateMonthlyReportForFamily} from "../ai-monthly-family-report/monthlyReportMain.service.js";

export const operationHandlers = {

  db_notification: async (payload) => {
    const { userId, title, body, type, data } = payload;
    await createNotification({ userId, title, body, type, data });
  },

  cloudinary_delete: async (payload) => {
    const { publicId } = payload;
    await deleteFromCloudinary(publicId);
  },



  ai_monthly_report_email: async (payload) => {

    const result = await generateMonthlyReportForFamily(payload);

    if (!result.success) {
      throw result.error;
    }

    if (result.failedUsers.length > 0) {

      payload.userIds = result.failedUsers.map(u => u.userId);

      throw new Error("Partial email delivery");
    }
  },

};


