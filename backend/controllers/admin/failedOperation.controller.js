import FailedOperation from "../../models/admin/failedOperation.model.js";
import {
  executeOperation,
  toggleAutoRetryStatus,
  getAutoRetryStatus,
} from "../../services/admin/failedOperation.service.js";

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

export const retryFailedOperation = async (req, res) => {
  try {
    const { id } = req.params;

    const op = await FailedOperation.findById(id);
    if (!op) {
      return res.status(404).json({
        success: false,
        message: "Failed operation not found",
      });
    }

    await executeOperation(op);

    op.status = "resolved";
    op.retryCount += 1;
    op.lastRetriedAt = new Date();
    op.error = undefined;
    op.nextRetryAt = null;

    await op.save();

    res.json({
      success: true,
      message: "Operation retried successfully",
      data: op,
    });
  } catch (error) {
    const { id } = req.params;

    const op = await FailedOperation.findById(id);
    if (op) {
      op.retryCount += 1;
      op.lastRetriedAt = new Date();
      op.error = {
        message: error.message,
        stack: error.stack,
      };
      op.nextRetryAt = new Date(Date.now() + 60 * 60 * 1000);
      await op.save();
    }

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