import express from "express";
import {
  familyDashboardController,
  individualDashboardController,
  getTrendsSummary
} from "../controllers/dashboard.controller.js";


import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// 🔐 Apply auth + family middleware to all routes
router.use(authenticateToken, requireFamily);


router.get("/family", familyDashboardController);

router.get("/individual", individualDashboardController)

router.get("/trends", getTrendsSummary)


export default router;