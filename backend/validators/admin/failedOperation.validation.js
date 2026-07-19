import Joi from "joi";

export const getFailedOperationsValidation = Joi.object({
  type: Joi.string().allow("").trim()
    .valid(
      "cloudinary_delete",
      "cloudinary_delete_multiple",
      "monthly_report_email",
      "db_notification",
      "request_log_export",
      "ai_monthly_report_email"
    )
    .optional(),

  status: Joi.string().allow("").trim()
    .valid("retrying", "failed", "resolved")
    .optional(),

  requestId: Joi.string().allow("").trim().optional(),

  search: Joi.string().allow("").trim().max(100).optional(),

  startDate: Joi.date().optional(),

  endDate: Joi.date().optional(),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  sortBy: Joi.string().allow("").trim()
    .valid(
      "createdAt",
      "updatedAt",
      "retryCount",
      "nextRetryAt"
    )
    .default("createdAt"),

  sortOrder: Joi.string().allow("").trim()
    .valid("asc", "desc")
    .default("desc"),
});