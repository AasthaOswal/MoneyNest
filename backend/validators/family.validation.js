import Joi from "joi";

const commonOptions = {
  stripUnknown: true,
  convert: true,
  abortEarly: true
};

// reusable field
const familyNameField = Joi.string()
  .trim()
  .min(3)
  .max(50)
  .messages({
    "string.empty": "Family name is required",
    "string.min": "Family name must be at least 3 characters",
    "string.max": "Family name cannot exceed 50 characters"
  });

// =======================
// 🟢 CREATE FAMILY
// =======================
export const createFamilySchema = Joi.object({
  familyName: familyNameField.required()
}).options(commonOptions);

// =======================
// 🟡 JOIN FAMILY
// =======================
export const joinFamilySchema = Joi.object({
  token: Joi.string()
    .trim()
    .pattern(/^[a-f0-9]{64}$/)
    .required()
    .messages({
      "string.empty": "Token is required",
      "string.pattern.base": "Invalid token format"
    })
}).options(commonOptions);

// =======================
// 🔵 EDIT FAMILY
// =======================
export const editFamilySchema = Joi.object({
  familyName: familyNameField.required()
}).options(commonOptions);