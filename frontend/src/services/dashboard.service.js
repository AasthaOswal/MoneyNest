// dashboard.service.js

import api from "../axios/axios";

const getFamilyDashboard = async (filters = {}) => {
  try {
    const response = await api.get("/dashboard/family", {
      params: filters, // ✅ this sends from & to
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching family:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const getIndividualDashbaord = async (filters = {}) => {
  try {
    const response = await api.get("/dashboard/individual", {
      params: filters,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching individual:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const getYearlyTrends = async ()=>{
  try {
    const response = await api.get("/dashboard/trends");
    return response.data;
  } catch (error) {
    console.error("Error fetching Yearly Trends:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


const getMonthlyAnalytics = async (filters={})=>{
  try {
    const response = await api.get("/dashboard/monthly", {params : filters});
    return response.data;
  } catch (error) {
    console.error("Error fetching Yearly Trends:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const DashboardService = {
  getIndividualDashbaord,
  getFamilyDashboard,
  getYearlyTrends,
  getMonthlyAnalytics,
};

export default DashboardService;