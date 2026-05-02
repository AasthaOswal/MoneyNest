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

const allowedTypes = ["income", "expense", "investment", "saving"];
const allowedGoalTypes = ["target", "limit"];
const allowedPeriods = ["daily", "weekly", "monthly", "yearly"];

export const createGoalValidation = Joi.object({
  title: Joi.string().trim().min(3).max(120).required(),

  type: Joi.string()
    .valid(...allowedTypes)
    .required(),

  goalType: Joi.string()
    .valid(...allowedGoalTypes)
    .required(),

  period: Joi.string()
    .valid(...allowedPeriods)
    .required(),

  amount: Joi.number()
    .positive()
    .required(),

  // optional, but if you keep them in request body, they will be rejected unless added here
  startDate: Joi.date(),
  endDate: Joi.date(),
}).unknown(false);

export const updateGoalValidation = Joi.object({
  title: Joi.string().trim().min(3).max(120),
  type: Joi.string().valid(...allowedTypes),
  goalType: Joi.string().valid(...allowedGoalTypes),
  period: Joi.string().valid(...allowedPeriods),
  amount: Joi.number().positive(),
  status: Joi.string().valid("active", "completed", "failed"),
}).min(1).unknown(false);

export const goalIdValidation = Joi.object({
  id: objectId.required(),
});