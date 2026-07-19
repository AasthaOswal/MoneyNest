import { createNotification } from "../../utils/notification/createNotification.js";
import { deleteFromCloudinary } from "../../utils/cloudinary/deleteFromCloudinary.js";
import { deleteMultipleFiles } from "../../utils/cloudinary/deleteMultipleFiles.js";
import { getFamilyReportData } from "../report/analytics.service.js";
import { generateReportPDF } from "../report/report.service.js";
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

  cloudinary_delete_multiple: async (payload) => {
    const ids = payload.publicIds.map(item => item.publicId);
    await deleteMultipleFiles(ids);
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



/**

  monthly_report_email: async (payload) => {
    const { email, familyId, from, to } = payload;

    const data = await getFamilyReportData({
      familyId,
      from: new Date(from),
      to: new Date(to),
    });

    const pdfBuffer = await generateReportPDF(data);
    const base64PDF = Buffer.from(pdfBuffer).toString("base64");

    await sendEmailBrevo({
      toEmail: email,
      subject: "📊 Monthly Finance Report",
      htmlContent: `<h2>Your Monthly Report</h2>`,
      attachments: [
        {
          name: "monthly-report.pdf",
          content: base64PDF,
        },
      ],
    });
  },
 */