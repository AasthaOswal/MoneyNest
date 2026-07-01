import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// =======================
// 🔐 AUTHENTICATE TOKEN
// =======================
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const headerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    // Get token from cookie
    const cookieToken = req.cookies?.accessToken;

    // Prefer header, fallback to cookie
    const token = headerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }


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

    console.error("Error in authenticate middleware: ", err);
      // 🔴 Access token expired
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      code: "ACCESS_TOKEN_EXPIRED",
      message: "Access token expired"
    });
  }

  // 🔴 Invalid token
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "Invalid token"
    });
  }

  return res.status(401).json({
    success: false,
    code: "AUTH_FAILED",
    message: "Authentication failed"
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
          message: "Access denied: You dont have permissions to perform this action."
        });
      }

      next();
    } catch (err) {
      console.error("Error in authorize roles middleware: ", err);
      return res.status(500).json({
        message: "Authorization error"
      });
    }
  };
};