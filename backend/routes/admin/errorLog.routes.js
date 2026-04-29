import express from "express";
import {
  getAllErrors,
  getErrorById,
  getErrorStats,
  getCriticalErrors,
  getErrorsByRequestId,
  deleteErrorLog,
  deleteErrorLogs,
} from "../../controllers/admin/errorLog.controller.js";

const router = express.Router();

// 🔹 1️⃣ Get all errors (filters: severity, date range, search)
router.get("/", getAllErrors);

// 🔹 2️⃣ Get error stats (top recurring errors)
router.get("/stats", getErrorStats);

// 🔹 3️⃣ Get critical errors (dashboard)
router.get("/critical", getCriticalErrors);

// 🔹 4️⃣ Get errors by requestId (trace debugging)
router.get("/request/:requestId", getErrorsByRequestId);

// 🔹 5️⃣ Get single error by ID
router.get("/:id", getErrorById);

// 🔹 6️⃣ Delete single error log
router.delete("/:id", deleteErrorLog);

// 🔹 7️⃣ Delete multiple logs (optional date filter)
router.delete("/", deleteErrorLogs);

export default router;