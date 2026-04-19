// import { getFamilyReportData } from "../services/report/analytics.service.js";
// import { generateReportPDF } from "../services/report/report.service.js";

// export const downloadMonthlyReport = async (req, res) => {
//   try {
//     const familyId = req.user.familyId;

//     // 👉 Last month date range
//     const from = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
//     const to = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

//     const data = await getFamilyReportData({ familyId, from, to });

//     const pdfBuffer = await generateReportPDF(data);

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=monthly-report.pdf"
//     });

//     res.send(pdfBuffer);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to generate report" });
//   }
// };

import { getFamilyReportData } from "../services/report/analytics.service.js";
import { generateReportPDF } from "../services/report/report.service.js";
import sendEmailBrevo from "../utils/email/sendEmailBrevo.js";

export const downloadMonthlyReport = async (req, res) => {
  try {
    const familyId = req.user.familyId;
    const email = req.user.email;

    // 👉 Last month
    const from = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const to = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

    const data = await getFamilyReportData({ familyId, from, to });

    const pdfBuffer = await generateReportPDF(data);

    // ✅ Convert to base64 for Brevo
    const buffer = Buffer.from(pdfBuffer);
    const base64PDF = buffer.toString("base64");

    console.log(Buffer.isBuffer(pdfBuffer)); // should be false (currently)
console.log(Buffer.isBuffer(buffer));    // should be true

    console.log(base64PDF.slice(0, 20));

    // ✅ Send Email
    await sendEmailBrevo({
      toEmail: email,
      subject: "Your Monthly Finance Report 📊",
      htmlContent: `
        <h2>Monthly Report</h2>
        <p>Your report for last month is attached.</p>
      `,
      attachments: [
            {
                name: "month-report.pdf",
                content: base64PDF
            }
        ]
    });

    // ✅ Optional: also allow download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=monthly-report.pdf"
    });

    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate report" });
  }
};