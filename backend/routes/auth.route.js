import express from "express";
import {
  signup,
  login,
  refreshAccessToken,
  logout
} from "../controllers/auth.controller.js";

const router = express.Router();

// =======================
// 🟢 AUTH ROUTES
// =======================

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Refresh Access Token
router.post("/refresh-token", refreshAccessToken);

// Logout
router.post("/logout", logout);

export default router;