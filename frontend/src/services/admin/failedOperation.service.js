import api from "../../axios/axios";

/**
 * Get Failed Operations
 */
export const getFailedOperations = async (params = {}) => {
  try {
    const response = await api.get("/admin/failed-operations", {
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getFailedOperationById = async (operationId) => {
  try {
    const response = await api.get(`/admin/failed-operations/${operationId}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retry Failed Operation
 */
export const retryFailedOperation = async (id) => {
  try {
    const response = await api.patch(
      `/admin/failed-operations/${id}/retry`
    );

    return response.data;
  } catch (error) {
    console.log(error.response)
    throw error;
  }
};

/**
 * Delete Failed Operation
 */
export const deleteFailedOperation = async (id) => {
  try {
    const response = await api.delete(
      `/admin/failed-operations/${id}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};