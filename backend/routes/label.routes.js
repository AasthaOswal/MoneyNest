import express from "express";
import {
  createLabel,
  deleteLabel
} from "../controllers/label.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// ➕ Create label
router.post(
  "/",
  authenticateToken,
  requireFamily,
  createLabel
);

// ❌ Delete label
router.delete(
  "/:id",
  authenticateToken,
  requireFamily,
  deleteLabel
);

export default router;