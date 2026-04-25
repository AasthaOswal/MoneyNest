import express from "express";
import {
  getRequestLogs,
  deleteRequestLog,
  deleteRequestLogs,
  exportRequestLogsNow,
  getAllStats,
  getSuspiciousActivity,
  getRequestById
} from "../../controllers/admin/requestLog.controller.js";


import { authenticateToken, authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("admin"), getRequestLogs);

router.get("/stats", authenticateToken, authorizeRoles("admin"), getAllStats);
router.get("/suspicious", authenticateToken, authorizeRoles("admin"), getSuspiciousActivity);
router.delete("/", authenticateToken, authorizeRoles("admin"), deleteRequestLogs);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteRequestLog);
router.post("/export", authenticateToken, authorizeRoles("admin"), exportRequestLogsNow);


router.get("/:id", authenticateToken, authorizeRoles("admin"), getRequestById);

export default router;

// routes/family.routes.js