import FailedOperation from "../../models/admin/failedOperation.model.js";
import { retrySingleOperation } from "../../services/retry/retrySingleFailedOperation.service.js";


export const getFailedOperations = async (req, res) => {
  try {
    const { type, status, search } = req.query;

    const filter = {};

    if (type) filter.operationType = type;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { operationType: new RegExp(search, "i") },
        { "error.message": new RegExp(search, "i") },
      ];
    }

    const data = await FailedOperation.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const retryFailedOperationById = async (req, res) => {
  try {
    const { id } = req.params;

    const operation = await FailedOperation.findById(id);

    if (!operation) {
      return res.status(404).json({
        success: false,
        message: "Operation not found",
      });
    }

    if (operation.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "Operation already resolved",
      });
    }

    const result = await retrySingleOperation(operation, {
      ignoreMaxRetries: true,
      resetRetryCount: true, // ✅ THIS LINE
    });

    res.json({
      success: true,
      result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFailedOperation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await FailedOperation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Failed operation not found",
      });
    }

    res.json({
      success: true,
      message: "Failed operation deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAllFailedOperations = async (req, res) => {
  try {
    await FailedOperation.deleteMany({});

    res.json({
      success: true,
      message: "All failed operations deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleRetry = async (req, res) => {
  try {
    const enabled = toggleAutoRetryStatus();

    res.json({
      success: true,
      retryEnabled: enabled,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRetryStatus = async (req, res) => {
  try {
    res.json({
      success: true,
      retryEnabled: getAutoRetryStatus(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};