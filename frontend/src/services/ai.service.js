import api from "../axios/axios";

/**
 * 🤖 Get AI Feature
 * @param {string} feature - Feature name (e.g. "financialHealth")
 */
const getAIFeature = async (feature) => {
  try {
    const response = await api.get(`/ai/${feature}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const AIService = {
  getAIFeature,
};

export default AIService;