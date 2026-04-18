import api from "../axios/axios";


const getFamilyDashboard = async () => {
  try {
    const response = await api.get("/dashboard/family");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching family:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const getIndividualDashbaord = async () => {
  try {
    const response = await api.get("/dashboard/individual");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching family:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const DashboardService = {
  getIndividualDashbaord,
  getFamilyDashboard
};

export default DashboardService;