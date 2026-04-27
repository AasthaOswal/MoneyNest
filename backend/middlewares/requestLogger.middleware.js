import RequestLog from "../models/admin/requestLog.model.js";
import { v4 as uuidv4 } from "uuid";

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // ✅ generate requestId
  req.requestId = uuidv4();

  // const shouldLog =
  // process.env.NODE_ENV === "development" ||
  // res.statusCode >= 400 ||
  // responseTimeMs > 500;



  res.on("finish", async () => {
    try {
      const responseTimeMs = Date.now() - start;
    
        await RequestLog.create({
        requestId: req.requestId,
        userId: req.user?._id || null,
        userEmail: req.user?.email || null,
        userRole: req.user?.role || null,
        ip: req.ip,                    // ALWAYS store

        method: req.method,
        path: req.originalUrl,

        statusCode: res.statusCode,
        responseTimeMs,

        userAgent: req.headers["user-agent"],

        actorType: req.user ? "authenticated" : "anonymous",

        
      });
      
    } catch (err) {
      console.error("RequestLog failed", err);
    }
  });

  next();
};