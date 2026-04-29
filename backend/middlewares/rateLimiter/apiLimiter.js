import rateLimit from "express-rate-limit";

// =======================
// 🔑 KEY GENERATOR
// =======================

const getClientKey = (req) => {
  // ✅ If logged in → use userId (BEST)
  if (req.user?._id) {
    return `user-${req.user._id.toString()}`;
  }

  // ✅ fallback → IP
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  return ip.startsWith("::ffff:") ? ip.slice(7) : ip;
};

// =======================
// 🧠 COMMON CONFIG
// =======================

const limiterDefaults = {
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientKey,
  skip: (req) => req.path === "/health",
};

const makeHandler = (name) => (req, res, next, options) => {
  console.warn(
    `[RATE LIMIT] ${name} | user: ${req.user?._id || "guest"} | IP: ${req.ip} | path: ${req.originalUrl}`
  );

  res.status(options.statusCode).json(options.message);
};

// =======================
// 🚀 LIMITERS
// =======================

// 🌐 General API (fallback)
export const generalLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  handler: makeHandler("generalLimiter"),
});

// 📖 Read-heavy routes (GET)
export const readLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 15 * 60 * 1000,
  max: 120, // slightly relaxed for dashboards
  message: {
    success: false,
    message: "Too many requests, please slow down.",
  },
  handler: makeHandler("readLimiter"),
});

// ✍️ Write routes (POST, PUT, DELETE)
export const writeLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many write requests, please try again later.",
  },
  handler: makeHandler("writeLimiter"),
});

// 📤 Uploads (Cloudinary / files)
export const uploadLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many uploads, please try again later.",
  },
  handler: makeHandler("uploadLimiter"),
});

// 📊 Export (Excel / reports)
export const exportLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many export requests, please try again later.",
  },
  handler: makeHandler("exportLimiter"),
});