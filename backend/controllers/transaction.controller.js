import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import Category from "../models/category.model.js";
import Label from "../models/label.model.js";

import { createTransactionSchema, updateTransactionSchema, getTransactionsValidation } from "../validators/transaction.validation.js";

import { validateAndUploadFiles } from "../utils/cloudinary/validateAndUploadFiles.js";
import { deleteFromCloudinary } from "../utils/cloudinary/deleteFromCloudinary.js";
import { deleteMultipleFiles } from "../utils/cloudinary/deleteMultipleFiles.js";

import { generateTransactionsExcel } from "../utils/excel/generateExcel.js";
import sendEmailBrevo from "../utils/email/sendEmailBrevo.js";

import { buildTransactionQuery } from "../services/transaction/buildTransactionQuery.js";


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

const validateCategoryOrLabel2 = async ({
  model,
  ids,
  familyId,
  fieldName
}) => {
  if (!ids || ids.length === 0) return;

  const docs = await model.find({
    _id: { $in: ids },
    family: familyId,
    isActive:true
  }).select("_id");

  const validIds = new Set(docs.map(doc => doc._id.toString()));

  const invalidIds = ids.filter(
    id => !validIds.has(id.toString())
  );

  if (invalidIds.length > 0) {
    const error = new Error(`Invalid ${fieldName} IDs: ${invalidIds.join(", ")}`);
    error.name = "InvalidCategoryOrLabel"; // Assign a custom name
    throw error;
  }
};


const validateCategoryOrLabel = async ({
  model,
  ids,
  familyId,
  fieldName,
  isActive // 👈 make dynamic
}) => {
  if (!ids || ids.length === 0) return;

  const query = {
    _id: { $in: ids },
    family: familyId
  };

  // ✅ Only apply when explicitly passed
  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  const docs = await model.find(query).select("_id");

  const validIds = new Set(docs.map(doc => doc._id.toString()));

  const invalidIds = ids.filter(
    id => !validIds.has(id.toString())
  );

  if (invalidIds.length > 0) {
    const error = new Error(`Invalid ${fieldName} IDs: ${invalidIds.join(", ")}`);
    error.name = "InvalidCategoryOrLabel";
    throw error;
  }
};


// =======================
// ➕ CREATE TRANSACTION
// =======================
export const createTransaction = async (req, res) => {
  let uploadedFiles;
  let dbSaved = false;

  try {
    const userId = req.user._id;
    const familyId = req.user.familyId;


    // Normalize category
    if (typeof req.body.category === "string") {
      req.body.category = [req.body.category];
    }

    // Normalize labels
    if (typeof req.body.labels === "string") {
      req.body.labels = [req.body.labels];
    }

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

    await Promise.all([
      validateCategoryOrLabel({
        model: Category,
        ids: value.category,
        familyId: req.user.familyId,
        isActive:true,
        fieldName: "category"
      }),
      validateCategoryOrLabel({
        model: Label,
        ids: value.labels,
        familyId: req.user.familyId,
        isActive:true,
        fieldName: "label"
      })
    ]);

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

    if(err.name === "InvalidCategoryOrLabel"){
      return res.status(400).json({success:false, message: "You can use only your own family's categories and labels."})
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
    const userFamilyId = req.user.familyId;

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
        message: "Only the person who has created transaction can edit their own transaction"
      });
    }

    // Normalize category
    if (req.body.category && typeof req.body.category === "string") {
      req.body.category = [req.body.category];
    }

    // Normalize labels
    if (req.body.labels && typeof req.body.labels === "string") {
      req.body.labels = [req.body.labels];
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

      await Promise.all([
        validateCategoryOrLabel({
          model: Category,
          ids: value.category,
          familyId: req.user.familyId,
          isActive:true,
          fieldName: "category"
        }),
        validateCategoryOrLabel({
          model: Label,
          ids: value.labels,
          familyId: req.user.familyId,
          isActive:true,
          fieldName: "label"
        })
      ]);

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

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: req.user._id },
      { $set: value },
      { new: true }
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

    if(err.name === "InvalidCategoryOrLabel"){
      return res.status(400).json({success:false, message: "You can use only your own family's categories and labels."})
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
      endDate,
      user,
      category,
      label
    } = req.query;

    const { error, value } = getTransactionsValidation.validate(
      { search, type, page, limit, minAmount, maxAmount, startDate, endDate, user, category, label },
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

    const pageNum = value.page;
    const limitNum = value.limit;
    const skip = (pageNum - 1) * limitNum;

    const query = {
      family: req.user.familyId
    };

    // ✅ type
    if (value.type) {
      query.type = value.type;
    }

    // ✅ user
    if (value.user?.length) {
      query.user = {
        $in: value.user.map(id => new mongoose.Types.ObjectId(id))
      };
    }

    // ✅ category (ARRAY)
    if (value.category?.length) {
      query.category = {
        $in: value.category.map(id => new mongoose.Types.ObjectId(id))
      };
      await validateCategoryOrLabel({
        model: Category,
        ids: value.category.map(id => new mongoose.Types.ObjectId(id)),
        familyId: req.user.familyId,
        fieldName: "category"
      })
      
    }

    // ✅ labels (ARRAY)
    if (value.label?.length) {
      
      await validateCategoryOrLabel({
        model: Label,
        ids: value.label.map(id => new mongoose.Types.ObjectId(id)),
        familyId: req.user.familyId,
        fieldName: "label"
      })

      query.labels = {
        $in: value.label.map(id => new mongoose.Types.ObjectId(id))
      };
    }

    // ✅ amount range
    if (value.minAmount || value.maxAmount) {
      query.amount = {};
      if (value.minAmount) query.amount.$gte = value.minAmount;
      if (value.maxAmount) query.amount.$lte = value.maxAmount;
    }

    // ✅ date range
    if (value.startDate || value.endDate) {
      query.date = {};
      if (value.startDate) query.date.$gte = new Date(value.startDate);
      if (value.endDate) query.date.$lte = new Date(value.endDate);
    }

    // ✅ search
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
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Transaction.countDocuments(query)
    ]);

    const groupedTransactions = {
  income: { transactions: [], total: 0 },
  expense: { transactions: [], total: 0 },
  investment: { transactions: [], total: 0 }
};

transactions.forEach(t => {
  const type = t.type;

  if (!groupedTransactions[type]) return;

  groupedTransactions[type].transactions.push(t);
  groupedTransactions[type].total += t.amount || 0;
});

    return res.status(200).json({
      success: true,
      data: groupedTransactions,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });

  } catch (err) {
    console.error("Error in getTransactions:", err);

    if(err.name === "InvalidCategoryOrLabel"){
      return res.status(400).json({success:false, message: "You can use only your own family's categories and labels."})
    }

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
        message: "Only the person who has created transaction can delete their own transaction"
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




export const downloadTransactionsExcel = async (req, res) => {
  try {
    const { error, value } = getTransactionsValidation.validate(req.query);

    if (error) {
      return res.status(400).json({ success: false, message: "Invalid filters" });
    }

    // 🔥 REMOVE pagination fields
    const { page, limit, ...filters } = value;

    const query = await buildTransactionQuery(filters, req.user);

    const transactions = await Transaction.find(query)
      .populate("category labels")
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const workbook = await generateTransactionsExcel(transactions);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("Excel Download Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const emailTransactionsExcel = async (req, res) => {
  try {
    const { email } = req.user;

    if(!email){
      return res.status(400).json({ success: false, message: "Email not found" });
    }

    const { error, value } = getTransactionsValidation.validate(req.query);

    if (error) {
      return res.status(400).json({ success: false, message: "Invalid filters" });
    }


    // 🔥 REMOVE pagination fields
    const { page, limit, ...filters } = value;

    const query = await buildTransactionQuery(filters, req.user);

    const transactions = await Transaction.find(query)
      .populate("category labels")
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const workbook = await generateTransactionsExcel(transactions);
    const buffer = await workbook.xlsx.writeBuffer();

    await sendEmailBrevo({
      toEmail: email,
      subject: "Filtered Transactions Report",
      htmlContent: "<p>Your filtered transactions are attached.</p>",
      attachments: [
        {
          content: buffer.toString("base64"),
          name: "transactions.xlsx",
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (err) {
    console.error("Email Excel Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};