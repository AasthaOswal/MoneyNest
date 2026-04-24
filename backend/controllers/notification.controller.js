import Notification from "../models/notification.model.js";
import mongoose from "mongoose";

// =======================
// 📥 GET ALL NOTIFICATIONS (with pagination)
// =======================
export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: userId };

    // Optional: filter unread
    if (req.query.unread === "true") {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};



// =======================
// 📄 GET SINGLE NOTIFICATION
// =======================
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notification",
      error: error.message,
    });
  }
};



// =======================
// ➕ CREATE NOTIFICATION (internal use)
// =======================
export const createNotification = async (req, res) => {
  try {
    const { user, title, body, type, data } = req.body;

    const notification = await Notification.create({
      user,
      title,
      body,
      type,
      data,
    });

    res.status(201).json({
      success: true,
      data: notification,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating notification",
      error: error.message,
    });
  }
};



// =======================
// ✅ MARK AS READ
// =======================
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};



// =======================
// ✅ MARK ALL AS READ
// =======================
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: error.message,
    });
  }
};



// =======================
// ❌ DELETE NOTIFICATION
// =======================
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};



// =======================
// 🔔 GET UNREAD COUNT (IMPORTANT)
// =======================
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount: count,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: error.message,
    });
  }
};