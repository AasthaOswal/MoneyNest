import express from "express";
import dotenv from "dotenv";
import http from "http";
// Load environment variables
dotenv.config();

import { initializeSocket } from "./config/socket.js";

import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import familyRoutes from "./routes/family.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import labelRoutes from './routes/label.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import goalRoutes from './routes/goal.routes.js';
import userRoutes from './routes/user.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import reportRoutes from './routes/report.routes.js'
import notificationRoutes from './routes/notification.routes.js';
import requestLogRoutes from "./routes/admin/requestLog.routes.js";
import errorLogRoutes from "./routes/admin/errorLog.routes.js";
import failedOperationRoutes from "./routes/admin/failedOperation.routes.js";



import {startGoalTracker} from './services/cron/goalTracker.js'
import { startMonthlyReportJob } from "./services/cron/monthlyReport.js";

import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { authenticateToken } from "./middlewares/auth.middleware.js";
import { startFailedOperationsRetry } from "./services/cron/failedOperationRetry.js";
import { startRequestLogExportCron } from "./services/cron/requestLogExport.js";
import {startFailedOperationsRetryNew} from "./services/cron/failedOperationNew.cron.js";
import { startAiMonthlyFinancialReportCron } from "./services/cron/aiMonthlyFamilyReport.cron.js";

import {globalErrorHandler} from "./middlewares/error.middleware.js";

import { createNotification } from "./utils/notification/createNotification.js";

import { startPersonalGoalTracker } from "./services/cron/goals/personalGoalTracker.cron.js";

import { startFamilyGoalTracker } from "./services/cron/goals/familyGoalTracker.cron.js";

const app = express();
const httpServer = http.createServer(app);


app.set("trust proxy", 1);



app.use(
  cors({
    origin: [
      "http://localhost:5173","https://project-money-nest.vercel.app","https://money-nest-one.vercel.app",
      process.env.CLIENT_URL // Support env-based URL
    ].filter(Boolean), // Remove undefined/null if env var is missing
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse incoming JSON payloads
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ limit: "4mb", extended: true }));
app.use(cookieParser());




connectDB();


// Basic test route
app.get("/", (req, res) => {
    res.send("WealthNest API is running...");
});



// log everything
app.use(requestLogger);

// public routes
app.use("/api/auth", authRoutes);

// 🔐 auth middleware
app.use("/api", authenticateToken);

// protected routes
app.use("/api/family" , familyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/request-logs", requestLogRoutes);
app.use("/api/admin/error-logs", errorLogRoutes);
app.use("/api/admin/failed-operations", failedOperationRoutes);


// initialize socket after app middlewares are ready
initializeSocket(httpServer, app);


if(process.env.START_AI_MONTHLY_REPORT_CRON === "true"){
startAiMonthlyFinancialReportCron();
}

startPersonalGoalTracker();
startFamilyGoalTracker();

// run cron job
// startGoalTracker();
// startMonthlyReportJob();
// startFailedOperationsRetry();
// startRequestLogExportCron();

// startFailedOperationsRetryNew();

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;


app.get("/test-cookie", (req, res) => {
  res.cookie("test", "123", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).send("Cookie sent");
});

app.get("/test-notification", async (req, res) => {
    const notification = await createNotification({
        userId: "69bd56ce68e2a684f848be3f",
        familyId: null,
        title: "Test Notification",
        body: "Hello",
    });

    res.json(notification);
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});