import ExcelJS from "exceljs";
import RequestLog from "../../models/admin/requestLog.model.js";
import FailedOperation from "../../models/admin/failedOperation.model.js";
import sendEmailBrevo from "../../utils/email/sendEmailBrevo.js";

export const exportRequestLogsAndEmail = async () => {
  const logs = await RequestLog.find({}).sort({ createdAt: 1 }).lean();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Request Logs");

  worksheet.columns = [
    { header: "User ID", key: "user", width: 30 },
    { header: "Method", key: "method", width: 12 },
    { header: "URL", key: "url", width: 40 },
    { header: "Status Code", key: "statusCode", width: 12 },
    { header: "Response Time (ms)", key: "responseTime", width: 18 },
    { header: "IP", key: "ip", width: 18 },
    { header: "User Agent", key: "userAgent", width: 35 },
    { header: "Created At", key: "createdAt", width: 25 },
  ];

  logs.forEach((log) => {
    worksheet.addRow({
      user: log.user ? String(log.user) : "",
      method: log.method || "",
      url: log.url || "",
      statusCode: log.statusCode ?? "",
      responseTime: log.responseTime ?? "",
      ip: log.ip || "",
      userAgent: log.userAgent || "",
      createdAt: log.createdAt ? new Date(log.createdAt).toLocaleString() : "",
    });
  });

  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();

  const fileName = `request-logs-${new Date().toISOString().slice(0, 10)}.xlsx`;

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

  await RequestLog.deleteMany({});
};

export const createFailedExportLog = async (error) => {
  await FailedOperation.create({
    operationType: "cron_job",
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