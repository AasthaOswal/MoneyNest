import express from "express";
import {
  createCategory,
  deleteCategory
} from "../controllers/category.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// ➕ Create category
router.post(
  "/",
  authenticateToken,
  requireFamily,
  createCategory
);

// ❌ Delete category
router.delete(
  "/:id",
  authenticateToken,
  requireFamily,
  deleteCategory
);

export default router;