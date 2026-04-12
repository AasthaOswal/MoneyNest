import express from "express";
import {
  createGoal,
  deleteGoal,
  updateGoal,
  getGoalById,
  getAllGoals
} from "../controllers/goal.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// 🔐 Protected routes
router.use(authenticateToken, requireFamily);

// ➕ Create label
router.post("/", createGoal);

// 📋 Get all labels
router.get("/", getAllGoals);

// 🔍 Get by ID
router.get("/:id", getGoalById);

// ✏️ Update label
router.patch("/:id", updateGoal);

// ❌ Delete label
router.delete("/:id", deleteGoal);

export default router;