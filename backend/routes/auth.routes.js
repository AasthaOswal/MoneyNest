import express from "express";
import {
  signup,
  login,
  googleAuth,     
  googleCallback,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

// =======================
// 🟢 AUTH ROUTES
// =======================

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Google OAuth
// This initiates the Google login flow
router.get("/google", googleAuth); 

// This handles the redirect back from Google
router.get("/google/callback", googleCallback);

// Refresh Access Token
router.post("/refresh-token", refreshAccessToken);

router.post("/forgot-password",  forgotPassword );



router.post("/reset-password/:token",  resetPassword );

// Logout
router.post("/logout", logout);

export default router;