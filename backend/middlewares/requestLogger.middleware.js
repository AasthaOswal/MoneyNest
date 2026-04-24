import RequestLog from "../models/requestLog.model.js";

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const responseTime = Date.now() - start;

      // only log important ones
      if (res.statusCode >= 400 || responseTime > 500) {
        await RequestLog.create({
          user: req.user?._id,
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          responseTime,
        });
      }
    } catch (err) {
      console.error("RequestLog failed", err);
    }
  });

  next();
};