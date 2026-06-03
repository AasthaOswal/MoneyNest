import Joi from "joi";

export const getRequestLogsValidation = Joi.object({
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

  sortBy: Joi.string()
    .valid(
      "createdAt",
      "statusCode",
      "responseTimeMs",
      "responseSizeKb"
    )
    .default("createdAt"),

  sortOrder: Joi.string()
    .valid("asc", "desc")
    .default("desc"),
}).options({
    stripUnknown:true,
    abortEarly:false,
});