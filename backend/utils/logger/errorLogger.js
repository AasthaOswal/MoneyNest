// utils/logger/errorLogger.js

import ErrorLog from "../../models/admin/errorLog.model.js";

export const errorLogger = async ({
  error,
  req = null,
  severity = "low",
  requestId = null,
}) => {
	try {
		const fingerprint = `${error.name}:${req?.method}:${req?.originalUrl}:${error.message}`;
		const allowedSeverities = ["low", "medium", "high", "critical"];

		const safeSeverity = allowedSeverities.includes(severity) ? severity : "low";

		await ErrorLog.findOneAndUpdate(
			{
				errorFingerprint: fingerprint,
			},

			{
				$inc: {
					occurrenceCount: 1,
				},

				$set: {
					lastOccurredAt: new Date(),
					isResolved: false,
				},

				$setOnInsert: {
					errorFingerprint: fingerprint,

					firstOccurredAt: new Date(),

					errorName: error.name || "Error",
					message: error.message || "Unknown error",
					stack: error.stack,

					requestId: requestId || req?.requestId,

					method: req?.method,
					path: req?.originalUrl || req?.path,
					ip: req?.ip,

					userId: req?.user?._id || null,

					severity: safeSeverity,
					environment: process.env.NODE_ENV || "development",
				},
			},

			{
				upsert: true,
				new: true,
			}
		);
	} catch (logErr) {
		console.error("Failed to log error:", logErr);
	}
};