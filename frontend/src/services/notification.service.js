import api from "../axios/axios";

/**
 * 📋 Get all notifications (with pagination + optional unread filter)
 * Example: { page: 1, limit: 10, unread: true }
 */
const getNotifications = async (params = {}) => {
  const response = await api.get("/notifications", { params });
  return response.data;
};

/**
 * 🔔 Get unread notifications count
 */
const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data;
};

/**
 * 🔍 Get notification by ID
 */
const getNotificationById = async (id) => {
  const response = await api.get(`/notifications/${id}`);
  return response.data;
};

/**
 * ✅ Mark single notification as read
 */
const markAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

/**
 * ✅ Mark all notifications as read
 */
const markAllAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};

/**
 * ❌ Delete notification
 */
const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

const NotificationService = {
  getNotifications,
  getUnreadCount,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

export default NotificationService;