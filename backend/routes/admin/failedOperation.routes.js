import express from "express";
import {
  getFailedOperations,
  // retryFailedOperation,
  // deleteFailedOperation,
  // deleteAllFailedOperations,
  // toggleRetry,
  // getRetryStatus,
} from "../../controllers/admin/failedOperation.controller.js";

const router = express.Router();

router.get("/", getFailedOperations);
// router.patch("/:id/retry", retryFailedOperation);
// router.delete("/:id", deleteFailedOperation);
// router.delete("/", deleteAllFailedOperations);
// router.patch("/retry-toggle", toggleRetry);
// router.get("/retry-status", getRetryStatus);

export default router;