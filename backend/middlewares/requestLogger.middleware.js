import RequestLog from "../models/admin/requestLog.model.js";
import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";

export const requestLogger = (req, res, next) => {
	const start = Date.now();

	req.requestId = uuidv4();

	res.on("finish", async () => {
		try {
			const responseTimeMs = Date.now() - start;

			const parser = new UAParser(req.headers["user-agent"]);
			const result = parser.getResult();

			// response size
			const responseSizeKb = Number(((Number(res.getHeader("content-length")) || 0) / 1024).toFixed(2));

			// origin
			const origin =
				req.headers.origin ||
				req.headers.referer ||
				"unknown";

			const originType =
				origin.includes("localhost")
				? "localhost"
				: "production";

			const logData = {
				requestId: req.requestId,

				userId: req.user?._id || null,
				userEmail: req.user?.email || null,
				userRole: req.user?.role || null,

				ip: req.ip,

				method: req.method,
				path: req.originalUrl,

				statusCode: res.statusCode,
				responseTimeMs,
				responseSizeKb,

				userAgent: req.headers["user-agent"],


				browser: result.browser.name || "Unknown",
				browserVersion: result.browser.version || null,

				os: result.os.name || "Unknown",
				osVersion: result.os.version || null,

				deviceType:
				result.device.type ||
				"desktop",

				origin,
				originType,

				referer: req.headers.referer || null,

				actorType: req.user
				? "authenticated"
				: "anonymous",
			};
			await RequestLog.create(logData);
		} catch (err) {
			console.error("RequestLog failed", err);
		}
	});

	next();
};