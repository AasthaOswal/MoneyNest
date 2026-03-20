import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// =======================
// 🔐 AUTHENTICATE TOKEN
// =======================
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (optional: fetch full user)
    const user = await User.findById(decoded.userId).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token expired or invalid"
    });
  }
};


// =======================
// 🔐 AUTHORIZE ROLES
// =======================
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions"
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        message: "Authorization error"
      });
    }
  };
};