import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import Category from "../models/category.model.js";
import Label from "../models/label.model.js";

import { createTransactionSchema, updateTransactionSchema, getTransactionsValidation } from "../validators/transaction.validation.js";

import { validateAndUploadFiles } from "../utils/cloudinary/validateAndUploadFiles.js";
import { deleteFromCloudinary } from "../utils/cloudinary/deleteFromCloudinary.js";
import { deleteMultipleFiles } from "../utils/cloudinary/deleteMultipleFiles.js";

import { generateTransactionsExcel } from "../services/transaction/generateExcel.js";
import {sendEmailBrevo} from "../utils/email/sendEmailBrevo.js";

import { buildTransactionQuery } from "../services/transaction/buildTransactionQuery.js";
import {errorLogger} from "../utils/logger/errorLogger.js";

import { getIO } from "../config/socket.js";


// FILE CONFIG
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

const validateCategory = async ({
  categoryId,
  familyId,
  transactionType,
  isActive = true
}) => {
  const category = await Category.findOne({
    _id: categoryId,
    family: familyId,
    isActive
  }).select("_id categoryType");

  if (!category) {
    const error = new Error("Invalid category");
    error.name = "InvalidCategory";
    throw error;
  }
  if (category.categoryType !== transactionType) {
    const error = new Error(
      `Category belongs to ${category.categoryType} but transaction type is ${transactionType}`
    );
    error.name = "CategoryTypeMismatch";
    throw error;
  }
};

const validateLabels = async ({
  labelIds,
  familyId,
  isActive = true
}) => {
  if (!labelIds?.length) return;

  const labels = await Label.find({
    _id: { $in: labelIds },
    family: familyId,
    isActive
  }).select("_id");

  const validIds = new Set(
    labels.map(label => label._id.toString())
  );

  const invalidIds = labelIds.filter(
    id => !validIds.has(id.toString())
  );

  if (invalidIds.length > 0) {
    const error = new Error(
      `Invalid labels: ${invalidIds.join(", ")}`
    );
    error.name = "InvalidLabel";
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
      validateCategory({
        categoryId: value.category,
        familyId: req.user.familyId,
        transactionType: value.type,
        isActive:true
      }),

      validateLabels({
        labelIds: value.labels,
        familyId: req.user.familyId,
        isActive:true
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

  

    //emit to family
    getIO().to(`family:${req.user.familyId}`).emit("transaction:new", {
      message: "New transaction added."
    });


    getIO().to(`family:${req.user.familyId}`).emit("notification", {
      type: "success",
      notification : {
        title: `Transaction created by a member of your family.`,
        body: "Please check Trasnactions page to see the updated transactions list."
      }
    });

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

    if ( err.name === "InvalidCategory" || err.name === "InvalidLabel" || err.name === "InvalidCategoryOrLabel" ){
      return res.status(400).json({success:false, message: "You can use only your own family's categories and labels that are active(not deleted)."});
    }

    if( err.name === "CategoryTypeMismatch"){
      return res.status(400).json({success:false, message: "Transaction type and category type must be same"});
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

    const finalType = value.type || existingTransaction.type;

    const finalCategory = value.category || existingTransaction.category;

    const validations = [];

    if (value.category) {
      validations.push(
        validateCategory({
          categoryId: finalCategory,
          familyId: req.user.familyId,
          transactionType: finalType,
          isActive: true
        })
      );
    }

    if (value.labels) {
      validations.push(
        validateLabels({
          labelIds: value.labels,
          familyId: req.user.familyId,
          isActive: true
        })
      );
    }

    await Promise.all(validations);

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

    //emit to family
    getIO().to(`family:${req.user.familyId}`).emit("transaction:update", {
      message: "Transaction updated."
    });

    getIO().to(`family:${req.user.familyId}`).emit("notification", {
      type: "success",
      notification : {
        title: `Transaction updated by a member of your family.`,
        body: "Please check Trasnactions page to see the updated transactions list."
      }
    });

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

    if ( err.name === "InvalidCategory" || err.name === "InvalidLabel" || err.name === "InvalidCategoryOrLabel" ){
      return res.status(400).json({success:false, message: "You can use only your own family's categories and labels that are active(not deleted)."})
    }

    if( err.name === "CategoryTypeMismatch"){
      return res.status(400).json({success:false, message: "Transaction type and category type must be same"});
    }

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// GET TRANSACTIONS --filtering can support multiple categories
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

    // category (ARRAY)
    if (value.category?.length) {

      await validateCategoryOrLabel({
        model: Category,
        ids: value.category.map(id => new mongoose.Types.ObjectId(id)),
        familyId: req.user.familyId,
        fieldName: "category"
      })
      
    }

    // labels (ARRAY)
    if (value.label?.length) {
      
      await validateCategoryOrLabel({
        model: Label,
        ids: value.label.map(id => new mongoose.Types.ObjectId(id)),
        familyId: req.user.familyId,
        fieldName: "label"
      })
    }


    const query = buildTransactionQuery( value, req.user );

    const [transactions, total, summaryResult] = await Promise.all([
      Transaction.find(query)
        .populate("category labels")
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Transaction.countDocuments(query),

      Transaction.aggregate([
        {
          $match: query
        },
        {
          $group: {
            _id: "$type",
            total: {
              $sum: "$amount"
            }
          }
        }
      ])
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

    const summary = {
      incomeTotal: 0,
      expenseTotal: 0,
      investmentTotal: 0,
      netBalance: 0
    };

    summaryResult.forEach(item => {
      if (item._id === "income") {
        summary.incomeTotal = item.total;
      }

      if (item._id === "expense") {
        summary.expenseTotal = item.total;
      }

      if (item._id === "investment") {
        summary.investmentTotal = item.total;
      }
    });

    summary.netBalance = summary.incomeTotal - summary.expenseTotal - summary.investmentTotal;

    return res.status(200).json({
      success: true,
      data: groupedTransactions,
      total, 
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      summary
    });

  } catch (err) {
    console.error("Error in getTransactions:", err);

    if ( err.name === "InvalidCategory" || err.name === "InvalidLabel" || err.name === "InvalidCategoryOrLabel" ){
      return res.status(400).json({success:false, message: "You can use only your own family's categories and labels that are active(not deleted)."})
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
    // throw new Error("Error generated on purpose");
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
    await errorLogger({
      error: err,
      req,
      severity: "low",
    });

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

    //emit to family
    getIO().to(`family:${req.user.familyId}`).emit("transaction:delete", {
      message: "Transaction deleted."
    });

    getIO().to(`family:${req.user.familyId}`).emit("notification", {
      type: "success",
      notification : {
        title: `Transaction deleted by a member of your family.`,
        body: "Please check Trasnactions page to see the updated transactions list."
      }
    });

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

    // category (ARRAY)
    if (value.category?.length) {

      await validateCategoryOrLabel({
        model: Category,
        ids: value.category.map(id => new mongoose.Types.ObjectId(id)),
        familyId: req.user.familyId,
        fieldName: "category"
      })
      
    }

    // labels (ARRAY)
    if (value.label?.length) {
      
      await validateCategoryOrLabel({
        model: Label,
        ids: value.label.map(id => new mongoose.Types.ObjectId(id)),
        familyId: req.user.familyId,
        fieldName: "label"
      })
    }

    // REMOVE pagination fields
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

    if ( err.name === "InvalidCategory" || err.name === "InvalidLabel" || err.name === "InvalidCategoryOrLabel" ){
      return res.status(400).json({success:false, message: "You can use only your own family's categories and labels that are active(not deleted)."})
    }

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

    // category (ARRAY)
    if (value.category?.length) {

      await validateCategoryOrLabel({
        model: Category,
        ids: value.category.map(id => new mongoose.Types.ObjectId(id)),
        familyId: req.user.familyId,
        fieldName: "category"
      })
      
    }

    // labels (ARRAY)
    if (value.label?.length) {
      
      await validateCategoryOrLabel({
        model: Label,
        ids: value.label.map(id => new mongoose.Types.ObjectId(id)),
        familyId: req.user.familyId,
        fieldName: "label"
      })
    }


    // REMOVE pagination fields
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

    if ( err.name === "InvalidCategory" || err.name === "InvalidLabel" || err.name === "InvalidCategoryOrLabel" ){
      return res.status(400).json({success:false, message: "You can use only your own family's categories and labels that are active(not deleted)."})
    }

    res.status(500).json({ success: false, message: "Server Error" });
  }
};