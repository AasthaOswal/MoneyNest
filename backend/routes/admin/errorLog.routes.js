import express from "express";
import {
  getErrorLogs,
  deleteErrorLog,
  deleteErrorLogs,
} from "../../controllers/admin/errorLog.controller.js";

const router = express.Router();

router.get("/", getErrorLogs);
router.delete("/", deleteErrorLogs);
router.delete("/:id", deleteErrorLog);

export default router;