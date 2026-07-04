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

const leaveFamily = async ()=>{
  try{
    const response = await api.patch("/family/leave");
    return response.data;

  }catch(error){
    console.error("Error leaving family:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const removeFamilyMember = async (userId)=>{
  try{
    const response = await api.patch(`/family/remove/${userId}`);
    return response.data;

  }catch(error){
    console.error("Error removing family member:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


const getFamilyMember = async (userId)=>{
  try{
    const response = await api.get(`/family/member/${userId}`);
    return response.data;

  }catch(error){
    console.error("Error removing family member:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const transferFamilyAdmin = async (userId) => {
  try {
    const response = await api.patch(
      `/family/transfer-admin/${userId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error transferring family admin:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

const requestFamilyDeletion = async () => {
  try {
    const response = await api.post("/family/request-deletion");
    return response.data;
  } catch (error) {
    console.error(
      "Error requesting family deletion:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

/**
 * Get all families (Admin)
 */
const getAllFamilies = async (params = {}) => {
  try {
    const response = await api.get("/family", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching families:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

/**
 * Get family details by ID (Admin)
 */
const getFamilyById = async (familyId) => {
  try {
    const response = await api.get(`/family/${familyId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching family:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

/**
 * Approve family deletion (Admin)
 */
const approveFamilyDeletion = async (familyId) => {
  try {
    const response = await api.patch(
      `/family/approve-deletion/${familyId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error approving family deletion:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};


const FamilyService = {
  createFamily,
  generateInvite,
  joinFamilyWithToken,
  getMyFamily,
  leaveFamily,
  removeFamilyMember,
  getFamilyMember,
  transferFamilyAdmin,
  requestFamilyDeletion,

  // Admin
  getAllFamilies,
  getFamilyById,
  approveFamilyDeletion,
};

export default FamilyService;