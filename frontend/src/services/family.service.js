import api from "../axios/axios";

/**
 * Create a new family group.
 * Expects: { name: "Family Name" } (or whatever your schema requires)
 */
const createFamily = async (familyData) => {
  const response = await api.post("/family/create", familyData);
  return response.data;
};

/**
 * Generate an invitation token.
 * Only accessible by users with the 'familyAdmin' role.
 */
const generateInvite = async () => {
  const response = await api.post("/family/invite");
  return response.data;
};

/**
 * Join an existing family using a token.
 * Expects: { token: "abc-123" }
 */
const joinFamilyWithToken = async (tokenData) => {
  const response = await api.post("/family/join", tokenData);
  return response.data;
};

/**
 * Retrieve the current user's family details and members.
 */
const getMyFamily = async () => {
  const response = await api.get("/family/me");
  return response.data;
};

const FamilyService = {
  createFamily,
  generateInvite,
  joinFamilyWithToken,
  getMyFamily,
};

export default FamilyService;