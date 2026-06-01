import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { makeRateLimitHandler } from "../rateLimiterSecurity/rateLimitLog.handler.js";
const isDev = process.env.NODE_ENV !== "production";
//reduced the limits just for testing if rate limiter works
const maxLimit = {
  signup: isDev ? 200 : 5,
  login: isDev ? 200 : 5,
  refreshToken: isDev ? 200 : 20,
  forgotPassword: isDev ? 200 : 3,
  resetPassword: isDev ? 200 : 5,
  googleAuth: isDev ? 200 : 10,
  logout: isDev ? 200 : 30,
};



// =======================
// 🔑 KEY GENERATORS
// =======================

const keyGenIP = (req) => {
  let ip =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "unknown";

  if (Array.isArray(ip)) ip = ip[0];

  // normalize localhost
  if (ip === "::1" || ip.includes("127.0.0.1")) {
    ip = "127.0.0.1";
  }

  return ip;
};

// Email-based (for login, signup, forgot password)
const keyGenEmail = (req) => {
  const ip = ipKeyGenerator(req);
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
  max: maxLimit.signup,
  message: {
    success: false,
    message: "Too many signup attempts. Try again after 15 minutes.",
  },
  handler: makeRateLimitHandler("signupLimiter"),
});

// 🔐 LOGIN (brute-force protection)
export const loginLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenEmail,
  skipSuccessfulRequests: true,
  windowMs: 15 * 60 * 1000,
  max: maxLimit.login,
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
  max: maxLimit.refreshToken,
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
  max: maxLimit.forgotPassword,
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
  max: maxLimit.resetPassword,
  message: {
    success: false,
    message: "Too many attempts. Link may be invalid or expired",
  },
  handler: makeHandler("resetPasswordLimiter"),
});

// 🌐 GOOGLE OAUTH (prevent abuse)
export const googleAuthLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenIP,
  windowMs: 15 * 60 * 1000,
  max: maxLimit.googleAuth,
  message: {
    success: false,
    message: "Too many Google login attempts.",
  },
  handler: makeHandler("googleAuthLimiter"),
});

export const googleCallbackLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenIP,
  windowMs: 15 * 60 * 1000,
  max: maxLimit.googleAuth,
  message: {
    success: false,
    message: "Too many Google callback attempts.",
  },
  handler: makeHandler("googleCallbackLimiter"),
});

// 🚪 LOGOUT (very light limit)
export const logoutLimiter = rateLimit({
  ...limiterDefaults,
  keyGenerator: keyGenIP,
  windowMs: 15 * 60 * 1000,
  max: maxLimit.logout,
  message: {
    success: false,
    message: "Too many logout requests.",
  },
  handler: makeHandler("logoutLimiter"),
});