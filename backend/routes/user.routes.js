import { getMyProfile, requestAccountDeletion, approveUserDeletion, getAllUsers, getUserById } from "../controllers/user.controller.js";
import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { requireNoFamily, requireFamily } from "../middlewares/family.middleware.js";


const router = Router();




// User requests deletion
router.post(
    "/deletion-request",
    authenticateToken,
    authorizeRoles("familyAdmin", "member"),
    requestAccountDeletion
);

// Admin approves deletion
router.patch(
    "/:userId/approve-deletion",
    authenticateToken,
    authorizeRoles("admin"),
    approveUserDeletion
);


router.get("/me", authenticateToken, authorizeRoles("familyAdmin", "member", "admin"), getMyProfile);

router.get("/", authenticateToken, authorizeRoles("admin"), getAllUsers);

router.get("/:userId", authenticateToken, authorizeRoles("admin"), getUserById);


export default router;