import Joi from "joi";
import mongoose from "mongoose";

// Helper for MongoDB ObjectId validation
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('"{{#label}}" must be a valid ObjectId');
  }
  return value;
};

const commonOptions = {
  stripUnknown: true,
  convert: true,
  abortEarly: true
};

// Create Transaction Schema
export const createTransactionSchema = Joi.object({
  type: Joi.string()
    .valid("income", "expense", "investment")
    .required()
    .messages({
      "string.base": "Transaction type must be a string",
      "any.only":
        "Transaction type must be one of: income, expense, or investment",
      "any.required": "Transaction type is required",
    }),

  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "Transaction title must be a string",
      "string.empty": "Transaction title is required",
      "string.min": "Transaction title must be at least 3 characters",
      "string.max": "Transaction title cannot exceed 100 characters",
      "any.required": "Transaction title is required",
    }),

  amount: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Amount must be a number",
      "number.min": "Amount cannot be negative",
      "any.required": "Amount is required",
    }),

  // Single category
  category: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "string.base": "Category ID must be a string",
      "string.empty": "Category is required",
      "any.required": "Category is required",
      "any.invalid": "Category ID is invalid",
    }),

  // Multiple labels
  labels: Joi.array()
    .items(Joi.string().custom(objectId))
    .min(1)
    .required()
    .messages({
      "array.base": "Labels must be an array",
      "array.min": "At least one label is required",
      "any.required": "Labels are required",
    }),

  description: Joi.string()
    .allow("", null)
    .max(500)
    .messages({
      "string.base": "Description must be a string",
      "string.max": "Description cannot exceed 500 characters",
    }),

  note: Joi.string()
    .allow("", null)
    .max(500)
    .messages({
      "string.base": "Note must be a string",
      "string.max": "Note cannot exceed 500 characters",
    }),

  date: Joi.date()
    .default(Date.now)
    .messages({
      "date.base": "Date must be a valid date",
    }),
}).options(commonOptions);


// Update Transaction Schema (All fields optional, but must be valid if provided)
export const updateTransactionSchema = Joi.object({
  type: Joi.string()
    .valid("income", "expense", "investment")
    .messages({
      "string.base": "Transaction type must be a string",
      "any.only":
        "Transaction type must be one of: income, expense, or investment",
    }),

  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .messages({
      "string.base": "Transaction title must be a string",
      "string.empty": "Transaction title cannot be empty",
      "string.min": "Transaction title must be at least 3 characters",
      "string.max": "Transaction title cannot exceed 100 characters",
    }),

  amount: Joi.number()
    .min(0)
    .messages({
      "number.base": "Amount must be a number",
      "number.min": "Amount cannot be negative",
    }),

  // Single category
  category: Joi.string()
    .custom(objectId)
    .messages({
      "string.base": "Category ID must be a string",
      "string.empty": "Category cannot be empty",
      "any.invalid": "Category ID is invalid",
    }),

  // Multiple labels
  labels: Joi.array()
    .items(Joi.string().custom(objectId))
    .min(1)
    .messages({
      "array.base": "Labels must be an array",
      "array.min": "At least one label is required",
    }),

  description: Joi.string()
    .allow("", null)
    .max(500)
    .messages({
      "string.base": "Description must be a string",
      "string.max": "Description cannot exceed 500 characters",
    }),

  note: Joi.string()
    .allow("", null)
    .max(500)
    .messages({
      "string.base": "Note must be a string",
      "string.max": "Note cannot exceed 500 characters",
    }),

  date: Joi.date()
    .messages({
      "date.base": "Date must be a valid date",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  })
  .options(commonOptions);



export const getTransactionsValidation = Joi.object({
  type: Joi.string()
    .valid("income", "expense", "investment")
    .messages({
      "string.base": "Transaction type must be a string",
      "any.only":
        "Transaction type must be one of: income, expense, or investment",
    }),

  search: Joi.string()
    .trim()
    .allow("", null)
    .messages({
      "string.base": "Search term must be a string",
    }),

  minAmount: Joi.number()
    .min(0)
    .messages({
      "number.base": "Minimum amount must be a number",
      "number.min": "Minimum amount cannot be negative",
    }),

  maxAmount: Joi.number()
    .min(0)
    .messages({
      "number.base": "Maximum amount must be a number",
      "number.min": "Maximum amount cannot be negative",
    }),

  startDate: Joi.date()
    .messages({
      "date.base": "Start date must be a valid date",
    }),

  endDate: Joi.date()
    .messages({
      "date.base": "End date must be a valid date",
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10)
    .messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 50",
    }),

  // ✅ user filter
  user: Joi.array()
    .items(Joi.string().custom(objectId))
    .single()
    .messages({
      "array.base": "User must be an array of user IDs",
    }),

  // ✅ category array
  category: Joi.array()
    .items(Joi.string().custom(objectId))
    .single()
    .messages({
      "array.base": "Category must be an array of category IDs",
    }),

  // ✅ label array
  label: Joi.array()
    .items(Joi.string().custom(objectId))
    .single()
    .messages({
      "array.base": "Label must be an array of label IDs",
    }),
}).custom((value, helpers) => {
    if (value.minAmount && value.maxAmount && value.minAmount > value.maxAmount) {
      return helpers.message("minAmount cannot be greater than maxAmount");
    }

    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      return helpers.message("startDate cannot be after endDate");
    }

    return value;
  })
  .options(commonOptions);