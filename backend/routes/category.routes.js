import express from "express";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
  getCategories
} from "../controllers/category.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();


// All routes below require a valid JWT (req.user) and family membership (req.user.familyId)
router.use(authenticateToken, requireFamily);


// ➕ Create category
router.post( "/", createCategory );


// 📋 Get all (with search/filter)
router.get("/", getCategories);

// 🔍 Get by ID
router.get("/:id", getCategoryById);

// ✏️ Update (name only)
router.patch("/:id", updateCategory);


// ❌ Delete category
router.delete( "/:id", deleteCategory );



export default router;