import express from "express";
import {
  getFailedOperations,
  retryFailedOperationById,
  deleteFailedOperation,
  getFailedOperationById
  // deleteAllFailedOperations,
  // toggleRetry,
  // getRetryStatus,
} from "../../controllers/admin/failedOperation.controller.js";

import { authenticateToken, authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken, authorizeRoles("admin"));

router.get("/", getFailedOperations);
router.patch("/:id/retry", retryFailedOperationById);
router.delete("/:id", deleteFailedOperation);
router.get("/:id", getFailedOperationById)
// router.delete("/", deleteAllFailedOperations);
// router.patch("/retry-toggle", toggleRetry);
// router.get("/retry-status", getRetryStatus);

export default router;