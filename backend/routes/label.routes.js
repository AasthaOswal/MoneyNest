import express from "express";
import {
  createLabel,
  deleteLabel,
  updateLabel,
  getLabelById,
  getLabels
} from "../controllers/label.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// 🔐 Protected routes
router.use(authenticateToken, requireFamily);

// ➕ Create label
router.post("/", createLabel);

// 📋 Get all labels
router.get("/", getLabels);

// 🔍 Get by ID
router.get("/:id", getLabelById);

// ✏️ Update label
router.patch("/:id", updateLabel);

// ❌ Delete label
router.delete("/:id", deleteLabel);

export default router;