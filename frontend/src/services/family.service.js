import api from "../axios/axios";

/**
 * Create a new family group.
 */
const createFamily = async (familyData) => {
  try {
    const response = await api.post("/family/create", familyData);
    return response.data;
  } catch (error) {
    console.error("Error creating family:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Generate an invitation token.
 */
const generateInvite = async () => {
  try {
    const response = await api.post("/family/invite");
    return response.data;
  } catch (error) {
    console.error("Error generating invite:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Join an existing family using a token.
 */
const joinFamilyWithToken = async (tokenData) => {
  try {
    const response = await api.post("/family/join", tokenData);
    return response.data;
  } catch (error) {
    console.error("Error joining family:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Retrieve the current user's family details and members.
 */
const getMyFamily = async () => {
  try {
    const response = await api.get("/family/me");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching family:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const FamilyService = {
  createFamily,
  generateInvite,
  joinFamilyWithToken,
  getMyFamily,
};

export default FamilyService;