import express from "express";
import {
  createTransaction,
  updateTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
  downloadTransactionsExcel,
  emailTransactionsExcel
} from "../controllers/transaction.controller.js";

import upload from "../middlewares/multer.middleware.js"; // your multer config
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

import { readLimiter, writeLimiter, uploadLimiter, exportLimiter, exportEmailLimiter } from "../middlewares/rateLimiter/apiLimiter.js";

const router = express.Router();

// 🔐 Apply auth + family middleware to all routes
router.use(authenticateToken, requireFamily);

// =======================
// ➕ CREATE TRANSACTION
// =======================
router.post(
  "/",
  upload.single("transactionDoc"),
  uploadLimiter,
  createTransaction
);

// =======================
// 📋 GET ALL TRANSACTIONS
// =======================
router.get("/", readLimiter, getTransactions);

// =======================
// 🔍 GET TRANSACTION BY ID
// =======================
router.get("/:transactionId", readLimiter, getTransactionById);

// =======================
// ✏️ UPDATE TRANSACTION
// =======================
router.patch(
  "/:transactionId",
  upload.single("transactionDoc"),
  uploadLimiter,
  updateTransaction
);

// =======================
// ❌ DELETE TRANSACTION
// =======================
router.delete("/:transactionId", writeLimiter, deleteTransaction);


// 📥 Download Excel
router.get("/export/excel", exportLimiter, downloadTransactionsExcel);

// 📧 Send Excel via email
router.post("/export/email", exportEmailLimiter, emailTransactionsExcel);

export default router;