import BlockedEntity from "../../models/security/blockedEntity.model.js";
import { getBlockedKeys } from "../../utils/security/rateLimitIdentity.js";

export const checkBlockedEntity = async (req, res, next) => {
  try {
    const keys = getBlockedKeys(req);
    const now = new Date();

    const blocked = await BlockedEntity.findOne({
      active: true,
      identifier: { $in: keys },
      $or: [{ isPermanent: true }, { blockedUntil: { $gt: now } }],
    }).lean();

    if (!blocked) return next();

    return res.status(403).json({
      success: false,
      message: "You are temporarily blocked due to suspicious activity.",
      data: {
        blockedUntil: blocked.blockedUntil,
        reason: blocked.reason,
      },
    });
  } catch (error) {
    return next(error);
  }
};