import express from "express";
import {
  familyDashboardController,
  individualDashboardController
} from "../controllers/dashboard.controller.js";


import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// 🔐 Apply auth + family middleware to all routes
router.use(authenticateToken, requireFamily);


router.get("/family", familyDashboardController);

router.get("/individual", individualDashboardController)


export default router;