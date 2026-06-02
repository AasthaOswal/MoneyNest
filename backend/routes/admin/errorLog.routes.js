import express from "express";
import {
  getAllErrors,
  getErrorById,
  getErrorStats,
  getCriticalErrors,
  getErrorsByRequestId,
  deleteErrorLog,
  deleteErrorLogs,
  resolveError
} from "../../controllers/admin/errorLog.controller.js";

const router = express.Router();

// Get all errors (filters: severity, date range, search)
router.get("/", getAllErrors);

// Get error stats (top recurring errors)
router.get("/stats", getErrorStats);

// Get critical errors (dashboard)
router.get("/critical", getCriticalErrors);

// Get errors by requestId (trace debugging)
router.get("/request/:requestId", getErrorsByRequestId);

// Get single error by ID
router.get("/:id", getErrorById);

// Delete single error log
router.delete("/:id", deleteErrorLog);

// Delete multiple logs (optional date filter)
router.delete("/", deleteErrorLogs);

// resolve error manually by admin
router.patch( "/:errorId/resolve", resolveError );

export default router;