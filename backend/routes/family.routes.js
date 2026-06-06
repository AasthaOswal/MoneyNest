// routes/family.routes.js

import express from "express";
import {
  createFamily,
  getMyFamily,
  generateInvite,
  joinFamilyWithToken,
  removeFamilyMember,
  leaveFamily,
  getFamilyMember
} from "../controllers/family.controller.js";

import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { requireNoFamily, requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// 🟢 Create family
router.post(
  "/create",
  authenticateToken,
  requireNoFamily,
  createFamily
);

// 🔐 Generate invite (admin only)
router.post(
  "/invite",
  authenticateToken,
  requireFamily,
  authorizeRoles("familyAdmin"),
  generateInvite
);

// 🟡 Join via token
router.post(
  "/join",
  authenticateToken,
  requireNoFamily,
  joinFamilyWithToken
);

// 🔵 Get my family
router.get(
  "/me",
  authenticateToken,
  requireFamily,
  getMyFamily
);

router.get("/member/:memberId", authenticateToken, requireFamily, authorizeRoles("familyAdmin"), getFamilyMember);

// 🔴 Remove member (familyAdmin only)
router.patch(
  "/remove/:memberId",
  authenticateToken,
  requireFamily,
  authorizeRoles("familyAdmin"),
  removeFamilyMember
);

// 🟠 Leave family
router.patch(
  "/leave",
  authenticateToken,
  requireFamily,
  leaveFamily
);

export default router;