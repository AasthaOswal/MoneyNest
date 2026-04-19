import { getFamilyReportData } from "../services/report/analytics.service.js";
import { generateReportPDF } from "../services/report/report.service.js";

export const downloadMonthlyReport = async (req, res) => {
  try {
    const familyId = req.user.familyId;

    // 👉 Last month date range
    const from = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const to = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

    const data = await getFamilyReportData({ familyId, from, to });

    const pdfBuffer = await generateReportPDF(data);

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