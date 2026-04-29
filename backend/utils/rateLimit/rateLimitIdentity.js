export const normalizeIp = (req) => {
  let ip =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "unknown";

  if (Array.isArray(ip)) ip = ip[0];
  if (typeof ip === "string") {
    ip = ip.split(",")[0].trim();
  }

  if (ip === "::1" || ip.includes("127.0.0.1")) {
    ip = "127.0.0.1";
  }

  if (ip.startsWith("::ffff:")) {
    ip = ip.slice(7);
  }

  return ip;
};

export const getRateLimitIdentity = (req) => {
  if (req.user?._id) {
    return {
      identifierType: "user",
      identifier: `user-${req.user._id.toString()}`,
      userId: req.user._id,
      ip: normalizeIp(req),
    };
  }

  return {
    identifierType: "ip",
    identifier: `ip-${normalizeIp(req)}`,
    userId: null,
    ip: normalizeIp(req),
  };
};

export const getBlockedKeys = (req) => {
  const ip = normalizeIp(req);

  const keys = [`ip-${ip}`];

  if (req.user?._id) {
    keys.unshift(`user-${req.user._id.toString()}`);
  }

  return keys;
};