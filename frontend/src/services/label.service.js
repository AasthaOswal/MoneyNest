import api from "../axios/axios";

/**
 * ➕ Create a new label
 * Expects: { name: "Important" }
 */
const createLabel = async (labelData) => {
  const response = await api.post("/labels", labelData);
  return response.data;
};

/**
 * 📋 Get all labels (with optional search)
 * Example: { search: "imp" }
 */
const getLabels = async (params = {}) => {
  const response = await api.get("/labels", { params });
  return response.data;
};

/**
 * 🔍 Get label by ID
 */
const getLabelById = async (id) => {
  const response = await api.get(`/labels/${id}`);
  return response.data;
};

/**
 * ✏️ Update label
 * Expects: { name: "Updated Name" }
 */
const updateLabel = async (id, updateData) => {
  const response = await api.patch(`/labels/${id}`, updateData);
  return response.data;
};

/**
 * ❌ Delete label
 */
const deleteLabel = async (id) => {
  const response = await api.delete(`/labels/${id}`);
  return response.data;
};

const LabelService = {
  createLabel,
  getLabels,
  getLabelById,
  updateLabel,
  deleteLabel,
};

export default LabelService;