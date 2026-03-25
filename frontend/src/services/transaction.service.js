import api from "../axios/axios";

/**
 * Create a new transaction
 * Supports file upload (transactionDoc)
 */
const createTransaction = async (transactionData) => {
  try {
    const formData = new FormData();

    // Append normal fields
    Object.keys(transactionData).forEach((key) => {
  if (key !== "transactionDoc") {
    const value = transactionData[key];

    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item); // ✅ THIS FIXES IT
      });
    } else {
      formData.append(key, value);
    }
  }
});

    // Append file (if exists)
    if (transactionData.transactionDoc) {
      formData.append("transactionDoc", transactionData.transactionDoc);
    }

    console.log(formData)

    const response = await api.post("/transactions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response);

    return response.data;

  } catch (error) {
    console.error("Create Transaction Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get all transactions (with filters)
 */
const getTransactions = async (params = {}) => {
  try {
    const response = await api.get("/transactions", { params });
    return response.data;

  } catch (error) {
    console.error("Get Transactions Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get transaction by ID
 */
const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/transactions/${id}`);
    return response.data;

  } catch (error) {
    console.error("Get Transaction By ID Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update transaction
 * Supports file update
 */
const updateTransaction = async (id, updateData) => {
  try {
    const formData = new FormData();

    Object.keys(updateData).forEach((key) => {
      if (key !== "transactionDoc") {
        formData.append(key, updateData[key]);
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

  } catch (error) {
    console.error("Update Transaction Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete transaction
 */
const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;

  } catch (error) {
    console.error("Delete Transaction Error:", error.response?.data || error.message);
    throw error;
  }
};

const TransactionService = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};

export default TransactionService;