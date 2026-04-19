import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();



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

import {startGoalTracker} from './services/cron/goalTracker.js'



const app = express();

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

// base route
app.use("/api/auth", authRoutes);
app.use("/api/family" , familyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
// run cron job
startGoalTracker();

// Basic test route
app.get("/", (req, res) => {
    res.send("WealthNest API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
