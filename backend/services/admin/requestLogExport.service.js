import ExcelJS from "exceljs";
import RequestLog from "../../models/admin/requestLog.model.js";
import FailedOperation from "../../models/admin/failedOperation.model.js";
import {sendEmailBrevo} from "../../utils/email/sendEmailBrevo.js";


export const exportRequestLogsAndEmail = async () => {
  try {
    // throw new Error("Testing retry cron");
    const logs = await RequestLog.find({}).sort({ createdAt: 1 }).lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Request Logs");

    worksheet.columns = [
      { header: "Request ID", key: "requestId", width: 30 },

      { header: "User ID", key: "userId", width: 30 },
      { header: "User Email", key: "userEmail", width: 30 },
      { header: "User Role", key: "userRole", width: 15 },

      { header: "Actor Type", key: "actorType", width: 15 },

      { header: "Method", key: "method", width: 10 },
      { header: "Path", key: "path", width: 40 },

      { header: "Status Code", key: "statusCode", width: 12 },
      { header: "Response Time (ms)", key: "responseTimeMs", width: 18 },

      { header: "IP", key: "ip", width: 18 },
      { header: "User Agent", key: "userAgent", width: 40 },

      { header: "Created At", key: "createdAt", width: 25 },
    ];

    logs.forEach((log) => {
      worksheet.addRow({
        requestId: log.requestId || "",

        userId: log.userId ? String(log.userId) : "",
        userEmail: log.userEmail || "",
        userRole: log.userRole || "",

        actorType: log.actorType || "",

        method: log.method || "",
        path: log.path || "",

        statusCode: log.statusCode ?? "",
        responseTimeMs: log.responseTimeMs ?? "",

        ip: log.ip || "",
        userAgent: log.userAgent || "",

        createdAt: log.createdAt
          ? new Date(log.createdAt).toLocaleString()
          : "",
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.autoFilter = { from: "A1", to: "M1" };

    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = `request-logs-${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    await sendEmailBrevo({
      toEmail: process.env.ADMIN_EMAIL,
      subject: "Weekly Request Logs Export",
      htmlContent: `
        <p>Hi Admin,</p>
        <p>Attached is the weekly request logs export.</p>
        <p>Total logs exported: <b>${logs.length}</b></p>
      `,
      attachments: [
        {
          name: fileName,
          content: Buffer.from(buffer).toString("base64"),
        },
      ],
    });

    console.log("✅ Export + Email sent successfully");
  } catch (error) {
    console.error("❌ Export failed:", error.message);

    await createFailedExportLog(error); // 🔥 IMPORTANT
  }
};

export const createFailedExportLog = async (error) => {
  await FailedOperation.create({
    operationType: "request_log_export",
    status: "failed",
    payload: {
      task: "weekly_request_export",
    },
    error: {
      message: error.message,
      stack: error.stack,
    },
    nextRetryAt: new Date(Date.now() + 60 * 60 * 1000),
  });
};