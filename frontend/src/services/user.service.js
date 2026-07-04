import api from "../axios/axios";

/**
 * 👤 Get My Profile
 */
export const getMyProfile = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔔 Save FCM Token
 */
export const saveFcmToken = async (tokenData) => {
  try {
    const response = await api.post("/users/fcm-token", tokenData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🗑️ Request Account Deletion
 */
export const requestAccountDeletion = async () => {
  try {
    const response = await api.post("/users/deletion-request");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * ✅ Approve User Deletion (Admin)
 */
export const approveUserDeletion = async (userId) => {
  try {
    const response = await api.patch(`/users/${userId}/approve-deletion`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 👥 Get All Users (Admin)
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get("/users", {
      params,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔍 Get User By Id (Admin)
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

