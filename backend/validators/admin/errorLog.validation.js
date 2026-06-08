import Joi from "joi";

export const getAllErrorsValidation = Joi.object({
  startDate: Joi.date().iso(),

  endDate: Joi.date()
    .iso()
    .when("startDate", {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref("startDate")),
    }),

  search: Joi.string()
    .trim()
    .max(100)
    .allow(""),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),

  sortBy: Joi.string().allow("").trim()
    .valid(
      "createdAt",
      "occurrenceCount",
      "severity",
      "lastOccurredAt"
    )
    .default("createdAt"),

  sortOrder: Joi.string().allow("").trim()
    .valid("asc", "desc")
    .default("desc"),

  severity: Joi.string().allow("").trim()
  .valid(
    "low",
    "medium",
    "high",
    "critical"
  ),

  environment: Joi.string().allow("").trim()
    .valid(
      "development",
      "production"
    ),

    isResolved: Joi.boolean()
  .truthy("true")
  .falsy("false")
  .allow("")
}).options({
    stripUnknown : true,
    abortEarly : false
});