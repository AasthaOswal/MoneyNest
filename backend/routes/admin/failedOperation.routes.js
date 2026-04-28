import express from "express";
import {
  getFailedOperations,
  retryFailedOperationById
  // deleteFailedOperation,
  // deleteAllFailedOperations,
  // toggleRetry,
  // getRetryStatus,
} from "../../controllers/admin/failedOperation.controller.js";

import { authorizeRoles } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authorizeRoles("admin"), getFailedOperations);
router.patch("/:id/retry", authorizeRoles("admin"), retryFailedOperationById);
// router.delete("/:id", deleteFailedOperation);
// router.delete("/", deleteAllFailedOperations);
// router.patch("/retry-toggle", toggleRetry);
// router.get("/retry-status", getRetryStatus);

export default router;