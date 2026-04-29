import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== "production";

// =======================
// 🔑 KEY GENERATORS
// =======================

// IP (fallback)
const keyGenIP = (req) => {
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  return ip.startsWith("::ffff:") ? ip.slice(7) : ip;
};

// Email-based (for login, signup, forgot password)
const keyGenEmail = (req) => {
  const ip = keyGenIP(req);
  const email = req.body?.email?.toLowerCase() || "no-email";
  return `${ip}-${email}`;
};

// Token-based (for reset password links)
const keyGenToken = (req) => {
  return req.params?.token || "missing-token";
};

// =======================
// 🧠 COMMON CONFIG
// =======================
const limiterDefaults = {
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health",
};

const makeHandler = (name) => (req, res, next, options) => {
  console.warn(
    `[RATE LIMIT] ${name} | IP: ${req.ip} | Path: ${req.originalUrl}`
  );

  res.status(options.statusCode).json(options.message);
};

// =======================
// 🚀 LIMITERS
// =======================

// 🟢 SIGNUP (prevent spam accounts)
export const signupLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenEmail,
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50 : 5,
  message: {
    success: false,
    message: "Too many signup attempts. Try again after 15 minutes.",
  },
  handler: makeHandler("signupLimiter"),
});

// 🔐 LOGIN (brute-force protection)
export const loginLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenEmail,
  skipSuccessfulRequests: true,
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50 : 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
  handler: makeHandler("loginLimiter"),
});

// 🔁 REFRESH TOKEN (prevent abuse)
export const refreshTokenLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenIP,
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 20,
  message: {
    success: false,
    message: "Too many refresh requests. Please slow down.",
  },
  handler: makeHandler("refreshTokenLimiter"),
});

// 🔑 FORGOT PASSWORD (prevent email spam)
export const forgotPasswordLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenEmail,
  windowMs: 60 * 60 * 1000,
  max: isDev ? 50 : 3,
  message: {
    success: false,
    message: "Too many reset requests. Please try again later.",
  },
  handler: makeHandler("forgotPasswordLimiter"),
});

// 🔄 RESET PASSWORD (token-based attack protection)
export const resetPasswordLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenToken,
  windowMs: 30 * 60 * 1000,
  max: isDev ? 50 : 5,
  message: {
    success: false,
    message: "Too many attempts. Link may be invalid or expired.",
  },
  handler: makeHandler("resetPasswordLimiter"),
});

// 🌐 GOOGLE OAUTH (prevent abuse)
export const googleAuthLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenIP,
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50 : 10,
  message: {
    success: false,
    message: "Too many Google login attempts.",
  },
  handler: makeHandler("googleAuthLimiter"),
});

// 🚪 LOGOUT (very light limit)
export const logoutLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenIP,
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 30,
  message: {
    success: false,
    message: "Too many logout requests.",
  },
  handler: makeHandler("logoutLimiter"),
});