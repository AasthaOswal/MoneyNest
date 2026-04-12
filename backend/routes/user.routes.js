import { saveFcmToken } from "../controllers/user.controller.js";
import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { requireNoFamily, requireFamily } from "../middlewares/family.middleware.js";


const router = Router();

router.post("/fcm-token", authenticateToken, authorizeRoles("familyAdmin", "member"), saveFcmToken);


export default router;