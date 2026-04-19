import express from "express";
import { downloadMonthlyReport } from "../controllers/report.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

router.get("/monthly", authenticateToken, requireFamily, downloadMonthlyReport);

export default router;