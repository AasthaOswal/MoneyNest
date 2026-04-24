import ErrorLog from "../models/errorLog.model.js";

export const getErrorLogs = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      search,
      url,
      ip,
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

    if (url) filter.url = new RegExp(url, "i");
    if (ip) filter.ip = new RegExp(ip, "i");
    if (userId) filter.user = userId;

    if (search) {
      filter.$or = [
        { message: new RegExp(search, "i") },
        { stack: new RegExp(search, "i") },
        { url: new RegExp(search, "i") },
        { ip: new RegExp(search, "i") },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      ErrorLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ErrorLog.countDocuments(filter),
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

export const deleteErrorLog = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ErrorLog.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Error log not found",
      });
    }

    res.json({
      success: true,
      message: "Error log deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteErrorLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const result = await ErrorLog.deleteMany(filter);

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