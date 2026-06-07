import api from "../axios/axios";

const createCategory = async (categoryData) => {
  try {
    const response = await api.post("/categories", categoryData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

const getCategories = async (params = {}) => {
  try {
    const response = await api.get("/categories", { params });
    return response.data;
  } catch (err) {
    throw err;
  }
};

const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

const updateCategory = async (id, updateData) => {
  try {
    const response = await api.patch(
      `/categories/${id}`,
      updateData
    );

    return response.data;
  } catch (err) {
    throw err;
  }
};



const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (err) {
    console.log(err)
    throw err;
  }
};

const CategoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

export default CategoryService;