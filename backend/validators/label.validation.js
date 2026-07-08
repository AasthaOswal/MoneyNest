import Joi from "joi";


const commonOptions = {
  stripUnknown: true,
  convert: true,
  abortEarly: true
};


export const createLabelSchema = Joi.object({
  name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9\s\-&]+$/)
    .lowercase()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "Label name must be a string",
      "string.empty": "Label name is required",
      "string.min": "Label name must be at least 2 characters",
      "string.max": "Label name cannot exceed 50 characters",
      "string.pattern.base":
        "Label name can only contain lowercase letters, numbers, spaces, hyphens (-), and &",
      "any.required": "Label name is required"
    })
}).options(commonOptions);

export const updateLabelSchema = Joi.object({
  name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9\s\-&]+$/)
    .lowercase()
    .min(2)
    .max(50)
    .messages({
      "string.base": "Label name must be a string",
      "string.empty": "Label name cannot be empty",
      "string.min": "Label name must be at least 2 characters",
      "string.max": "Label name cannot exceed 50 characters",
      "string.pattern.base":
        "Label name can only contain lowercase letters, numbers, spaces, hyphens (-), and &"
    })
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update"
  })
  .options(commonOptions);

export const getLabelsSchema = Joi.object({
  search: Joi.string()
    .trim()
    .lowercase()
    .max(20)
    .allow("")
    .messages({
      "string.base": "Search must be a string",
      "string.max": "Search query cannot exceed 20 characters"
    })
    .optional(),
    isActive: Joi.string()
    .trim()
    .lowercase()
    .messages({
      "string.base": "isActive must be either true or false"
    })
    .optional()
}).options(commonOptions);