import Joi from "joi";

const commonOptions = {
  stripUnknown: true,
  convert: true,
  abortEarly: true
};

/*
this pattern : pattern(/^[a-zA-Z0-9\s\-&]+$/)
👉 Allows:

Dog Food
Dog-Food
Food & Drinks

❌ Blocks:

<script>
$ne
random injection strings
*/

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9\s\-&]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "Category name must be a string",
      "string.empty": "Category name is required",
      "string.min": "Category name must be at least 2 characters",
      "string.max": "Category name cannot exceed 50 characters",
      "string.pattern.base":
        "Category name can only contain letters, numbers, spaces, hyphens (-), and &",
      "any.required": "Category name is required"
    }),

  categoryType: Joi.string()
    .valid("income", "expense", "investment")
    .required()
    .messages({
      "string.base": "Category type must be a string",
      "any.only":
        "Category type must be one of: income, expense, or investment",
      "any.required": "Category type is required"
    })
}).options(commonOptions);

export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9\s\-&]+$/)
    .min(2)
    .max(50)
    .messages({
      "string.base": "Category name must be a string",
      "string.empty": "Category name cannot be empty",
      "string.min": "Category name must be at least 2 characters",
      "string.max": "Category name cannot exceed 50 characters",
      "string.pattern.base":
        "Category name can only contain letters, numbers, spaces, hyphens (-), and &"
    }),

  categoryType: Joi.string()
    .valid("income", "expense", "investment")
    .messages({
      "string.base": "Category type must be a string",
      "any.only":
        "Category type must be one of: income, expense, or investment"
    })
}).options(commonOptions)
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update"
  });


export const getCategoriesSchema = Joi.object({
  search: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9\s\-&]+$/)
    .min(1)
    .max(50)
    .allow("")
    .messages({
      "string.base": "Search must be a string",
      "string.empty": "Search cannot be empty",
      "string.min": "Search must be at least 1 character",
      "string.max": "Search cannot exceed 50 characters",
      "string.pattern.base":
        "Search can only contain letters, numbers, spaces, hyphens (-), and &"
    }),

  type: Joi.string()
    .allow("")
    .valid("income", "expense", "investment", "")
    .messages({
      "string.base": "Category type must be a string",
      "any.only":
        "Category type must be one of: income, expense, or investment"
    }),

  isActive: Joi.boolean()
    .allow("")
    .messages({
      "boolean.base": "isActive must be true or false"
    }),

  showDeleted: Joi.boolean()
    .allow("")
    .messages({
      "boolean.base": "showDeleted must be true or false"
    })
}).options(commonOptions);