import api from "../../axios/axios";

/**
 * Get all error logs
 */
const getErrorLogs = async (params = {}) => {
  try {
    const response = await api.get("/admin/error-logs", {
      params,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get single error log
 */
const getErrorLogById = async (id) => {
  try {
    const response = await api.get(`/admin/error-logs/${id}`);

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete error log
 */
const deleteErrorLog = async (id) => {
  try {
    const response = await api.delete(`/admin/error-logs/${id}`);

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Resolve error
 */
const resolveError = async (errorId) => {
  try {
    const response = await api.patch(
      `/admin/error-logs/${errorId}/resolve`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const ErrorLogService = {
  getErrorLogs,
  getErrorLogById,
  deleteErrorLog,
  resolveError,
};

export default ErrorLogService;