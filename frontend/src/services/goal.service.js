import api from "../axios/axios";

/**
 * ➕ Create a new goal
 */
const createGoal = async (goalData) => {
  const response = await api.post("/goals", goalData);
  return response.data;
};

/**
 * 📋 Get all goals
 * (you can later add filters like period, type etc.)
 */
const getGoals = async (params = {}) => {
  const response = await api.get("/goals", { params });
  return response.data;
};

/**
 * 🔍 Get goal by ID
 */
const getGoalById = async (id) => {
  const response = await api.get(`/goals/${id}`);
  return response.data;
};

/**
 * ✏️ Update goal
 */
const updateGoal = async (id, updateData) => {
  const response = await api.patch(`/goals/${id}`, updateData);
  return response.data;
};

/**
 * ❌ Delete goal
 */
const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

const GoalService = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};

export default GoalService;