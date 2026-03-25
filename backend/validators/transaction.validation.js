import Joi from "joi";

// Helper for MongoDB ObjectId validation
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid ObjectId');
  }
  return value;
};

// 1. Create Transaction Schema
export const createTransactionSchema = Joi.object({
  type: Joi.string().valid("income", "expense", "investment").required(),
  title: Joi.string().trim().min(1).max(100).required(),
  amount: Joi.number().min(0).required(),
  // Validating as an array of ObjectIds based on your model note
  category: Joi.array().items(Joi.string().custom(objectId)).min(1).required(),
  labels: Joi.array().items(Joi.string().custom(objectId)).min(1).required(),
  description: Joi.string().allow("", null).max(500),
  note: Joi.string().allow("", null).max(500),
  date: Joi.date().default(Date.now),
});

// 2. Update Transaction Schema (All fields optional, but must be valid if provided)
export const updateTransactionSchema = Joi.object({
  type: Joi.string().valid("income", "expense", "investment"),
  title: Joi.string().trim().min(1).max(100),
  amount: Joi.number().min(0),
  category: Joi.array().items(Joi.string().custom(objectId)).min(1),
  labels: Joi.array().items(Joi.string().custom(objectId)).min(1),
  description: Joi.string().allow("", null).max(500),
  note: Joi.string().allow("", null).max(500),
  date: Joi.date(),
}).min(1); // Ensure at least one field is being updated

// 3. Get Transactions Validation (For query params like filtering/pagination)
export const getTransactionsValidation = Joi.object({
  familyId: Joi.string().custom(objectId),
  type: Joi.string().valid("income", "expense", "investment"),
  startDate: Joi.date(),
  endDate: Joi.date(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});