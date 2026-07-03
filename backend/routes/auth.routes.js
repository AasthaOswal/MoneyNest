import express from "express";
import {
  signup,
  login,
  googleAuth,     
  googleCallback,
  logout,
  forgotPassword,
  resetPassword,
  getSocketToken
} from "../controllers/auth.controller.js";

import { signupLimiter, loginLimiter, refreshTokenLimiter, googleAuthLimiter, googleCallbackLimiter,  logoutLimiter, forgotPasswordLimiter, resetPasswordLimiter } from "../middlewares/rateLimiter/authLimiter.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

// =======================
// 🟢 AUTH ROUTES
// =======================

// Signup
router.post("/signup", signupLimiter, signup);

// Login
router.post("/login", loginLimiter, login);

// Google OAuth
// This initiates the Google login flow
router.get("/google", googleAuthLimiter, googleAuth); 

// This handles the redirect back from Google
router.get("/google/callback", googleCallbackLimiter, googleCallback);

// Refresh Access Token
// router.post("/refresh-token", refreshTokenLimiter, refreshAccessToken);

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);



router.post("/reset-password/:token", resetPasswordLimiter, resetPassword );

// Logout
router.post("/logout", authenticateToken, logoutLimiter, logout);


router.get("/socket-token", authenticateToken, getSocketToken);


export default router;