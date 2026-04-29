import RateLimitLog from "../../models/admin/rateLimitLog.model.js";
import BlockedEntity from "../../models/admin/blockedEntity.model.js";
import { getRateLimitIdentity, getBlockedKeys } from "../../utils/rateLimit/rateLimitIdentity.js";

const DEFAULT_CONFIG = {
  windowMinutes: 15,
  blockMinutes: 30,
  threshold: 5,
};

const severityConfig = {
  generalLimiter: { ...DEFAULT_CONFIG },
  readLimiter: { ...DEFAULT_CONFIG, threshold: 8, blockMinutes: 20 },
  writeLimiter: { ...DEFAULT_CONFIG, threshold: 4, blockMinutes: 30 },
  uploadLimiter: { ...DEFAULT_CONFIG, threshold: 3, blockMinutes: 60 },
  exportLimiter: { ...DEFAULT_CONFIG, threshold: 2, blockMinutes: 60 },
  exportEmailLimiter: { ...DEFAULT_CONFIG, threshold: 2, blockMinutes: 60 },

  signupLimiter: { ...DEFAULT_CONFIG, threshold: 3, blockMinutes: 60 },
  loginLimiter: { ...DEFAULT_CONFIG, threshold: 4, blockMinutes: 30 },
  refreshTokenLimiter: { ...DEFAULT_CONFIG, threshold: 5, blockMinutes: 30 },
  forgotPasswordLimiter: { ...DEFAULT_CONFIG, threshold: 3, blockMinutes: 60 },
  resetPasswordLimiter: { ...DEFAULT_CONFIG, threshold: 3, blockMinutes: 60 },
  googleAuthLimiter: { ...DEFAULT_CONFIG, threshold: 5, blockMinutes: 30 },
  googleCallbackLimiter: { ...DEFAULT_CONFIG, threshold: 5, blockMinutes: 30 },
  logoutLimiter: { ...DEFAULT_CONFIG, threshold: 8, blockMinutes: 15 },
};

export const createRateLimitLog = async (req, limiterName, options = {}) => {
  const identity = getRateLimitIdentity(req);

  const log = await RateLimitLog.create({
    limiterName,
    identifierType: identity.identifierType,
    identifier: identity.identifier,
    userId: identity.userId,
    ip: identity.ip,
    method: req.method,
    path: req.originalUrl,
    message: options.message || "",
    statusCode: options.statusCode || 429,
    userAgent: req.headers["user-agent"] || "",
    metadata: {
      body: req.body || {},
      params: req.params || {},
      query: req.query || {},
      ...options.metadata,
    },
  });

  return log;
};

export const isCurrentlyBlocked = async (req) => {
  const keys = getBlockedKeys(req);
  const now = new Date();

  const blocked = await BlockedEntity.findOne({
    active: true,
    identifier: { $in: keys },
    $or: [{ isPermanent: true }, { blockedUntil: { $gt: now } }],
  }).lean();

  return blocked;
};

export const autoBlockFromRecentLimitHits = async (
  req,
  limiterName,
  {
    windowMinutes = severityConfig[limiterName]?.windowMinutes ?? DEFAULT_CONFIG.windowMinutes,
    blockMinutes = severityConfig[limiterName]?.blockMinutes ?? DEFAULT_CONFIG.blockMinutes,
    threshold = severityConfig[limiterName]?.threshold ?? DEFAULT_CONFIG.threshold,
  } = {}
) => {
  const identity = getRateLimitIdentity(req);
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);

  const hits = await RateLimitLog.countDocuments({
    identifier: identity.identifier,
    createdAt: { $gte: since },
  });

  if (hits < threshold) return null;

  const blockedUntil = new Date(Date.now() + blockMinutes * 60 * 1000);

  const block = await BlockedEntity.findOneAndUpdate(
    {
      identifierType: identity.identifierType,
      identifier: identity.identifier,
    },
    {
      $set: {
        identifierType: identity.identifierType,
        identifier: identity.identifier,
        userId: identity.userId,
        ip: identity.ip,
        reason: `Too many rate limit violations on ${limiterName}`,
        blockedUntil,
        isPermanent: false,
        active: true,
        lastTriggeredAt: new Date(),
        metadata: {
          limiterName,
          threshold,
          windowMinutes,
          blockMinutes,
          hits,
        },
      },
      $inc: { triggerCount: 1 },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return block;
};

export const cleanupExpiredBlocks = async () => {
  const now = new Date();

  await BlockedEntity.updateMany(
    {
      active: true,
      isPermanent: false,
      blockedUntil: { $lte: now },
    },
    {
      $set: { active: false },
    }
  );
};