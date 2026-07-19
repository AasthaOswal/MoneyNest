import api from "../axios/axios";

/**
 * 👤 Get My Profile
 */
export const getMyProfile = async () => {
  try {
    const response = await api.get("/user/me");
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
    const response = await api.post("/user/deletion-request");
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
    const response = await api.patch(`/user/${userId}/approve-deletion`);
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
    const response = await api.get("/user", {
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
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

