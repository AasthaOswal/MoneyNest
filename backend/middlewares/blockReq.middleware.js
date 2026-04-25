import BlockedEntity from "../models/admin/blockedEntity.model.js";

export const blockMiddleware = async (req, res, next) => {
  try {
    const ip = req.ip;
    const userId = req.user?._id?.toString();

    const blocked = await BlockedEntity.findOne({
      isActive: true,
      $or: [
        { type: "ip", value: ip },
        ...(userId ? [{ type: "user", value: userId }] : []),
      ],
    });

    if (blocked) {
      return res.status(403).json({
        success: false,
        message: "Access blocked due to suspicious activity",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};