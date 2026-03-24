import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  categoryType: Joi.string()
    .valid("income", "expense", "investment")
    .required()
});