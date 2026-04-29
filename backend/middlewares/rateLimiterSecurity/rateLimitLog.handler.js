import {
  createRateLimitLog,
  autoBlockFromRecentLimitHits,
} from "../../services/rateLimit/rateLimitSecurity.js";

export const makeRateLimitHandler = (limiterName) => {
  return (req, res, _next, options) => {
    void (async () => {
      try {
        await createRateLimitLog(req, limiterName, options);
        await autoBlockFromRecentLimitHits(req, limiterName);
      } catch (error) {
        console.error(`[RATE LIMIT LOG ERROR] ${limiterName}`, error);
      }

      res.status(options.statusCode).json(options.message);
    })();
  };
};