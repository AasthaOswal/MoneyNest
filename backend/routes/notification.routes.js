import express from "express";
import {
  getAllNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notification.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requireFamily } from "../middlewares/family.middleware.js";

const router = express.Router();

// 🔐 Protected routes
router.use(authenticateToken, requireFamily);

// 📋 Get all notifications
router.get("/", getAllNotifications);

// 🔔 Get unread count
router.get("/unread-count", getUnreadCount);

// 🔍 Get notification by ID
router.get("/:id", getNotificationById);

// ✅ Mark as read
router.patch("/:id/read", markAsRead);

// ✅ Mark all as read
router.patch("/read-all", markAllAsRead);

// ❌ Delete notification
router.delete("/:id", deleteNotification);

export default router;