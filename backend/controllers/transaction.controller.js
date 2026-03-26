import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";

import { createTransactionSchema, updateTransactionSchema, getTransactionsValidation } from "../validators/transaction.validation.js";

import { validateAndUploadFiles } from "../utils/cloudinary/validateAndUploadFiles.js";
import { deleteFromCloudinary } from "../utils/cloudinary/deleteFromCloudinary.js";
import { deleteMultipleFiles } from "../utils/cloudinary/deleteMultipleFiles.js";

// =======================
// 📁 FILE CONFIG
// =======================
const fileConfigs = [
  {
    fieldName: "transactionDoc",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSize: 2 * 1024 * 1024, // 2MB
    friendlyName: "Transaction Document"
  }
];

// =======================
// ➕ CREATE TRANSACTION
// =======================
export const createTransaction = async (req, res) => {
  let uploadedFiles;
  let dbSaved = false;

  try {
    const userId = req.user._id;
    const familyId = req.user.familyId;

    const { error, value } = createTransactionSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      const validationErrors = error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // Upload file (optional)
    if (req.files && Object.keys(req.files).length > 0) {
      uploadedFiles = await validateAndUploadFiles(req.files, fileConfigs);
    }

    const transaction = new Transaction({
      ...value,
      user: userId,
      family: familyId,
      transactionDoc: uploadedFiles?.transactionDoc
        ? {
            url: uploadedFiles.transactionDoc.url,
            publicId: uploadedFiles.transactionDoc.publicId
          }
        : null
    });

    await transaction.save();
    dbSaved = true;

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction
    });

  } catch (err) {
    console.error("Error in createTransaction:", err);

    if (!dbSaved && uploadedFiles) {
      const publicIds = Object.values(uploadedFiles).map(f => f.publicId);
      await deleteMultipleFiles(publicIds);
    }

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// =======================
// ✏️ UPDATE TRANSACTION
// =======================
export const updateTransaction = async (req, res) => {
  let uploadedFiles = null;
  let dbSaved = false;

  try {
    const { transactionId } = req.params;

    if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
    }

    const existingTransaction = await Transaction.findById(transactionId);

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    // 🔐 Ownership check
    if (existingTransaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { error, value } = updateTransactionSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      const validationErrors = error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    let oldPublicId = null;

    // File handling
    if (req.files && Object.keys(req.files).length > 0) {
      uploadedFiles = await validateAndUploadFiles(req.files, fileConfigs);

      if (uploadedFiles.transactionDoc) {
        oldPublicId = existingTransaction.transactionDoc?.publicId;

        value.transactionDoc = {
          url: uploadedFiles.transactionDoc.url,
          publicId: uploadedFiles.transactionDoc.publicId
        };
      }
    }

    if (Object.keys(value).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { $set: value },
      { new: true, runValidators: true }
    );

    dbSaved = true;

    // Delete old file after success
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId).catch(err =>
        console.error("Cloudinary delete failed:", err)
      );
    }

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction
    });

  } catch (err) {
    console.error("Error in updateTransaction:", err);

    if (!dbSaved && uploadedFiles) {
      const publicIds = Object.values(uploadedFiles).map(f => f.publicId);
      await deleteMultipleFiles(publicIds);
    }

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// =======================
// 📋 GET TRANSACTIONS
// =======================
export const getTransactions = async (req, res) => {
  try {
    const {
      search,
      type,
      page,
      limit,
      minAmount,
      maxAmount,
      startDate,
      endDate
    } = req.query;

    const { error, value } = getTransactionsValidation.validate(
      { search, type, page, limit, minAmount, maxAmount, startDate, endDate },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    const pageNum = value.page || 1;
    const limitNum = Math.min(value.limit || 10, 50);
    const skip = (pageNum - 1) * limitNum;

    const query = {
      family: req.user.familyId
    };

    if (value.type) query.type = value.type;

    if (value.minAmount || value.maxAmount) {
      query.amount = {};
      if (value.minAmount) query.amount.$gte = value.minAmount;
      if (value.maxAmount) query.amount.$lte = value.maxAmount;
    }

    if (value.search) {
      const safeSearch = value.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
        { note: { $regex: safeSearch, $options: "i" } }
      ];
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate("category labels")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Transaction.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: transactions,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });

  } catch (err) {
    console.error("Error in getTransactions:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// =======================
// 🔍 GET TRANSACTION BY ID
// =======================
export const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // ✅ Validate ID
    if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
    }

    // ✅ Find transaction
    const transaction = await Transaction.findById(transactionId)
      .populate("category labels")
      .lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    // 🔐 Ownership - family check (IMPORTANT)
    if (
      transaction.family.toString() !== req.user.familyId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction
    });

  } catch (err) {
    console.error("Error in getTransactionById:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// =======================
// ❌ DELETE TRANSACTION
// =======================
export const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
    }

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    await Transaction.findByIdAndDelete(transactionId);

    if (transaction.transactionDoc?.publicId) {
      await deleteFromCloudinary(transaction.transactionDoc.publicId)
        .catch(err => console.error("Cloudinary delete failed:", err));
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully"
    });

  } catch (err) {
    console.error("Error in deleteTransaction:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};