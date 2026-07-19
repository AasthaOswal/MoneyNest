import express from "express";
import { aiFeature } from "../controllers/aiFeature.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// 🔐 Protected routes
router.use(authenticateToken, requireFamily);


router.get("/:feature", aiFeature);


export default router;