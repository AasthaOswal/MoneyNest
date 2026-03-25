import express from "express";
import {
  createTransaction,
  updateTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction
} from "../controllers/transaction.controller.js";

import upload from "../middlewares/multer.middleware.js"; // your multer config
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// 🔐 Apply auth + family middleware to all routes
router.use(authenticateToken, requireFamily);

// =======================
// ➕ CREATE TRANSACTION
// =======================
router.post(
  "/",
  upload.fields([
    { name: "transactionDoc", maxCount: 1 }
  ]),
  createTransaction
);

// =======================
// 📋 GET ALL TRANSACTIONS
// =======================
router.get("/", getTransactions);

// =======================
// 🔍 GET TRANSACTION BY ID
// =======================
router.get("/:transactionId", getTransactionById);

// =======================
// ✏️ UPDATE TRANSACTION
// =======================
router.patch(
  "/:transactionId",
  upload.fields([
    { name: "transactionDoc", maxCount: 1 }
  ]),
  updateTransaction
);

// =======================
// ❌ DELETE TRANSACTION
// =======================
router.delete("/:transactionId", deleteTransaction);

export default router;