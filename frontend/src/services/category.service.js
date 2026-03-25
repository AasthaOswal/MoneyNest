import api from "../axios/axios";

/**
 * Create a new category.
 * Expects: { name: "Groceries", color: "#FF5733", icon: "basket" }
 */
const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);

  console.log(response)
  return response.data;
};

/**
 * Retrieve all categories for the user's family.
 * Supports optional search/filter queries.
 */
const getCategories = async (params = {}) => {
  const response = await api.get("/categories", { params });
  return response.data;
};

/**
 * Get a specific category by its ID.
 */
const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

/**
 * Update a category (typically the name or visual style).
 * Expects: { name: "Updated Name" }
 */
const updateCategory = async (id, updateData) => {
  const response = await api.patch(`/categories/${id}`, updateData);
  return response.data;
};

/**
 * Delete a category by ID.
 */
const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

const CategoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

export default CategoryService;