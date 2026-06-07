import api from "../axios/axios";

/**
 * ➕ Create Label
 */
const createLabel = async (labelData) => {
  try {
    const response = await api.post("/labels", labelData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 📋 Get Labels
 */
const getLabels = async (params = {}) => {
  try {
    const response = await api.get("/labels", {
      params,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 🔍 Get Label By Id
 */
const getLabelById = async (id) => {
  try {
    const response = await api.get(`/labels/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * ✏️ Update Label
 */
const updateLabel = async (id, updateData) => {
  try {
    const response = await api.patch(`/labels/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * ❌ Delete Label
 */
const deleteLabel = async (id) => {
  try {
    const response = await api.delete(`/labels/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const LabelService = {
  createLabel,
  getLabels,
  getLabelById,
  updateLabel,
  deleteLabel,
};

export default LabelService;