import api from "../../axios/axios";

/**
 * Get all request logs
 */
const getRequestLogs = async (params = {}) => {
  try {
    const response = await api.get("/admin/request-logs", {
      params,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get single request log
 */
const getRequestLogById = async (id) => {
  try {
    const response = await api.get(`/admin/request-logs/${id}`);

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete request log
 */
const deleteRequestLog = async (id) => {
  try {
    const response = await api.delete(
      `/admin/request-logs/${id}`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Export request logs
 */
const exportRequestLogs = async () => {
  try {
    const response = await api.post(
      "/admin/request-logs/export"
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const RequestLogService = {
  getRequestLogs,
  getRequestLogById,
  deleteRequestLog,
  exportRequestLogs,
};

export default RequestLogService;