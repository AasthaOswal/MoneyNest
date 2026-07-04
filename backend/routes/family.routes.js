// routes/family.routes.js

import express from "express";
import {
  createFamily,
  getMyFamily,
  generateInvite,
  joinFamilyWithToken,
  removeFamilyMember,
  leaveFamily,
  getFamilyMember,
  transferFamilyAdmin,
  getAllFamilies,
  getFamilyById,
  requestFamilyDeletion
} from "../controllers/family.controller.js";

import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { requireNoFamily, requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// Create family
router.post(
  "/create",
  authenticateToken,
  requireNoFamily,
  createFamily
);

// Generate invite (admin only)
router.post(
  "/invite",
  authenticateToken,
  requireFamily,
  authorizeRoles("familyAdmin"),
  generateInvite
);

// Join via token
router.post(
  "/join",
  authenticateToken,
  requireNoFamily,
  joinFamilyWithToken
);

// Get my family
router.get(
  "/me",
  authenticateToken,
  requireFamily,
  getMyFamily
);

router.get("/member/:memberId", authenticateToken, requireFamily, authorizeRoles("familyAdmin"), getFamilyMember);

// Remove member (familyAdmin only)
router.patch(
  "/remove/:memberId",
  authenticateToken,
  requireFamily,
  authorizeRoles("familyAdmin"),
  removeFamilyMember
);

// Leave family
router.patch(
  "/leave",
  authenticateToken,
  requireFamily,
  leaveFamily
);


// ransfer family admin
router.patch(
  "/transfer-admin/:newAdminId",
  authenticateToken,
  requireFamily,
  authorizeRoles("familyAdmin"),
  transferFamilyAdmin
);


router.get("/", authenticateToken, authorizeRoles("admin"), getAllFamilies);

router.get("/:familyId", authenticateToken, authorizeRoles("admin"), getFamilyById);


router.post("/request-deletion", authenticateToken, requireFamily, authorizeRoles("familyAdmin"), requestFamilyDeletion);
export default router;