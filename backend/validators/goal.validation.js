/**type + goalType validation ❌
amount > 0 ❌
startDate < endDate ❌
 */


import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
}, "ObjectId validation");

const commonOptions = {
  stripUnknown: true,
  convert: true,
  abortEarly: true
};


const allowedTypes = ["income", "expense", "investment", "preInvestmentSavings" ,"netSavings"];
const allowedGoalTypes = ["target", "limit"];

export const createGoalValidation = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(120)
    .required()
    .messages({
      "string.base": "Goal title must be a string",
      "string.empty": "Goal title is required",
      "string.min": "Goal title must be at least 3 characters ",
      "string.max": "Goal title cannot exceed 120 characters",
      "any.required": "Goal title is required",
    }),

  type: Joi.string()
    .valid(...allowedTypes)
    .required()
    .messages({
      "string.base": "Goal type must be a string",
      "any.only":
        "Goal type must be one of: income, expense, investment, preInvestmentSavings, or netSavings",
      "any.required": "Goal type is required",
    }),

  goalType: Joi.string()
    .valid(...allowedGoalTypes)
    .required()
    .messages({
      "string.base": "Goal category must be a string",
      "any.only": "Goal category must be either target or limit",
      "any.required": "Goal category is required",
    }),

  amount: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be greater than 0",
      "any.required": "Amount is required",
    }),

  visibility: Joi.string()
    .valid("family", "personal")
    .required()
    .messages({
      "string.base": "Visibility must be a string",
      "any.only": "Visibility must be either family or personal",
      "any.required": "Visibility is required",
    }),

  startDate: Joi.date()
    .required()
    .messages({
      "date.base": "Start date must be a valid date",
      "any.required": "Start date is required",
    }),

  endDate: Joi.date()
    .required()
    .messages({
      "date.base": "End date must be a valid date",
      "any.required": "End date is required",
    }),
}).options(commonOptions);



export const updateGoalValidation = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(120)
    .messages({
      "string.base": "Goal title must be a string",
      "string.empty": "Goal title cannot be empty",
      "string.min": "Goal title must be at least 3 characters",
      "string.max": "Goal title cannot exceed 120 characters",
    }),

  type: Joi.string()
    .valid(...allowedTypes)
    .messages({
      "string.base": "Goal type must be a string",
      "any.only":
        "Goal type must be one of: income, expense, investment, preInvestmentSavings, or netSavings",
    }),

  goalType: Joi.string()
    .valid(...allowedGoalTypes)
    .messages({
      "string.base": "Goal category must be a string",
      "any.only": "Goal category must be either target or limit",
    }),

  amount: Joi.number()
    .positive()
    .messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be greater than 0",
    }),

  visibility: Joi.string()
    .valid("family", "personal")
    .messages({
      "string.base": "Visibility must be a string",
      "any.only": "Visibility must be either family or personal",
    }),

  status: Joi.string()
    .valid("active", "completed", "failed")
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of: active, completed, or failed",
    }),

  startDate: Joi.date()
    .messages({
      "date.base": "Start date must be a valid date",
    }),

  endDate: Joi.date()
    .messages({
      "date.base": "End date must be a valid date",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  })
  .options(commonOptions);


export const getGoalsValidation = Joi.object({
  visibility: Joi.string()
    .valid("family", "personal")
    .allow("", null)
    .messages({
      "string.base": "Visibility must be a string",
      "any.only": "Visibility must be either family or personal",
    }),

  status: Joi.string()
    .valid("active", "completed", "failed")
    .allow("", null)
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of: active, completed, or failed",
    }),

  type: Joi.string()
    .valid(...allowedTypes)
    .allow("", null)
    .messages({
      "string.base": "Goal type must be a string",
      "any.only":
        "Goal type must be one of: income, expense, investment, preInvestmentSavings, or netSavings",
    }),

  goalType: Joi.string()
    .valid(...allowedGoalTypes)
    .allow("", null)
    .messages({
      "string.base": "Goal category must be a string",
      "any.only": "Goal category must be either target or limit",
    }),

  search: Joi.string()
    .trim()
    .allow("", null)
    .messages({
      "string.base": "Search term must be a string",
    }),

  sortBy: Joi.string()
    .valid("createdAt", "endDate", "startDate", "amount", "title")
    .allow("", null)
    .default("createdAt")
    .messages({
      "string.base": "Sort field must be a string",
      "any.only":
        "Sort field must be one of: createdAt, endDate, startDate, amount, or title",
    }),

  order: Joi.string()
    .valid("asc", "desc")
    .allow("", null)
    .default("desc")
    .messages({
      "string.base": "Sort order must be a string",
      "any.only": "Sort order must be either asc or desc",
    }),
}).options(commonOptions);