import express from "express";
import {
  familyDashboardController,
  individualDashboardController,
  getTrendsSummary,
  getMonthlyAnalytics,
  getYearlyTrends
} from "../controllers/dashboard.controller.js";


import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// 🔐 Apply auth + family middleware to all routes
router.use(authenticateToken, requireFamily);


router.get("/family", familyDashboardController);

router.get("/individual", individualDashboardController)

router.get("/trends", getYearlyTrends);

router.get("/monthly", getMonthlyAnalytics)


export default router;