import RequestLog from "../models/requestLog.model.js";
import { exportRequestLogsAndEmail } from "../services/requestLogExport.service.js";

export const getRequestLogs = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      method,
      statusCode,
      search,
      userId,
      page = 1,
      limit = 100,
    } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (method) filter.method = method;
    if (statusCode) filter.statusCode = Number(statusCode);
    if (userId) filter.user = userId;

    if (search) {
      filter.$or = [
        { url: new RegExp(search, "i") },
        { method: new RegExp(search, "i") },
        { ip: new RegExp(search, "i") },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      RequestLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      RequestLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRequestLog = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await RequestLog.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Request log not found",
      });
    }

    res.json({
      success: true,
      message: "Request log deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRequestLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const result = await RequestLog.deleteMany(filter);

    res.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const exportRequestLogsNow = async (req, res) => {
  try {
    await exportRequestLogsAndEmail();

    res.json({
      success: true,
      message: "Request logs exported and emailed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};