import express from "express";
import {
  getRequestLogs,
  deleteRequestLog,
  deleteRequestLogs,
  exportRequestLogsNow,
} from "../../controllers/admin/requestLog.controller.js";

const router = express.Router();

router.get("/", getRequestLogs);
router.delete("/", deleteRequestLogs);
router.delete("/:id", deleteRequestLog);
router.post("/export", exportRequestLogsNow);

export default router;