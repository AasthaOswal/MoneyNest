import api from "../axios/axios";
import qs from "qs";

/**
 * Create a new transaction
 * Supports file upload (transactionDoc)
 */
const createTransaction = async (transactionData) => {
  const formData = new FormData();

  Object.keys(transactionData).forEach((key) => {
    if (key !== "transactionDoc") {
      const value = transactionData[key];

      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value);
      }
    }
  });

  if (transactionData.transactionDoc) {
    formData.append("transactionDoc", transactionData.transactionDoc);
  }

  const response = await api.post("/transactions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Get all transactions (with filters)
 */
const getTransactions = async (params = {}) => {
  const response = await api.get("/transactions", {
    params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });

  return response.data;
};

/**
 * Get transaction by ID
 */
const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

/**
 * Update transaction
 * Supports file update
 */
const updateTransaction = async (id, updateData) => {
  const formData = new FormData();

  Object.keys(updateData).forEach((key) => {
    if (key !== "transactionDoc") {
      const value = updateData[key];

      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value);
      }
    }
  });

  if (updateData.transactionDoc) {
    formData.append("transactionDoc", updateData.transactionDoc);
  }

  const response = await api.patch(`/transactions/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Delete transaction
 */
const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

/**
 * Download transactions Excel
 */
const downloadTransactionsExcel = async (params = {}) => {
  const response = await api.get("/transactions/export/excel", {
    params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    responseType: "blob",
  });

  return response.data;
};

/**
 * Email transactions Excel
 */
const emailTransactionsExcel = async (params = {}) => {
  const response = await api.post(
    "/transactions/export/email",
    {},
    {
      params,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    }
  );

  return response.data;
};

const TransactionService = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  downloadTransactionsExcel,
  emailTransactionsExcel,
};

export default TransactionService;