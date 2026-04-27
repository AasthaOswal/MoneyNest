import cron from "node-cron";
import User from "../../models/user.model.js"; // adjust path
import { getFamilyReportData } from "../../services/report/analytics.service.js";
import { generateReportPDF } from "../../services/report/report.service.js";
import {sendEmailBrevo} from "../../utils/email/sendEmailBrevo.js";
import { createFailedOperation } from "../../utils/failedOperation/failedOperationCreator.js";

const MONTHLY_REPORT_CRON = "0 9 1 * *"; //Runs at 9:00 AM on the 1st day of every month
const MONTHLY_REPORT_CRON_TESTING = "* * * * *"; //every minute

// const MONTHLY_REPORT_CRON_TESTING = "*/2 * * * *"; // every 2 minutes

export const startMonthlyReportJob = () => {

  // 🔥 Runs on 1st of every month at 9:00 AM
  cron.schedule(MONTHLY_REPORT_CRON_TESTING, async () => {
    console.log("📊 Running Monthly Report Cron...");
    let from,to;

    try {
      // 👉 Get all users (or family heads - better later)
      const users = await User.find({}).select("email familyId");

      for (const user of users) {
        try {
          if (!user.email || !user.familyId) continue;

          

          // 👉 Last month
          const now = new Date();

          // from = new Date(now.getFullYear(), now.getMonth() - 1, 1);

          // to = new Date(now.getFullYear(), now.getMonth(), 0);
          // to.setHours(23, 59, 59, 999); // 🔥 IMPORTANT

          //just for testing
          from = new Date(0); // all data
          to = new Date();

          // throw new Error("Simulated Cron Failure for testing retry logic");

          const data = await getFamilyReportData({
            familyId: user.familyId,
            from,
            to
          });

          console.log(data)

          const pdfBuffer = await generateReportPDF(data);

          const base64PDF = Buffer.from(pdfBuffer).toString("base64");

          await sendEmailBrevo({
            toEmail: user.email,
            subject: "📊 Monthly Finance Report",
            htmlContent: `
              <h2>Your Monthly Report</h2>
              <p>Attached is your report for last month.</p>
            `,
            attachments: [
              {
                name: "monthly-report.pdf",
                content: base64PDF
              }
            ]
          });

          console.log(`✅ Sent report to ${user.email}`);

        } catch (err) {
          console.error(`❌ Failed for ${user.email}`, err.message);
              await createFailedOperation({
                operationType: "monthly_report_email",
                payload: {
                  email: user.email,
                  familyId: user.familyId,
                  from,
                  to,
                },
                error: err,
              });
        }
      }

    } catch (err) {
      console.error("❌ Cron Job Error:", err);
    }
  });
};