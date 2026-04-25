import RequestLog from "../../models/admin/requestLog.model.js";
import { exportRequestLogsAndEmail } from "../../services/admin/requestLogExport.service.js";


// ✅ 1. GET LOGS (unchanged but improved)
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
        { path: new RegExp(search, "i") },
        { method: new RegExp(search, "i") },
        { ip: new RegExp(search, "i") },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      RequestLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      RequestLog.countDocuments(filter),
    ]);

    res.json({ success: true, total, page, limit, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getRequestById = async (req, res) => {
  try {
    const log = await RequestLog.findById(req.params.id).populate("user");

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Request log not found",
      });
    }

    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllStats = async (req, res) => {
  try {
    const [routeStats, highLatencyRoutes] = await Promise.all([

      // ✅ ROUTE STATS
      RequestLog.aggregate([
        {
          $group: {
            _id: "$path",
            totalRequests: { $sum: 1 },
            avgResponseTime: { $avg: "$responseTimeMs" },
            errorCount: {
              $sum: {
                $cond: [{ $gte: ["$statusCode", 400] }, 1, 0],
              },
            },
          },
        },
        { $sort: { totalRequests: -1 } },
      ]),

      // ✅ HIGH LATENCY ROUTES
      RequestLog.aggregate([
        { $match: { responseTimeMs: { $gt: 500 } } },
        {
          $group: {
            _id: "$path",
            avgResponseTime: { $avg: "$responseTimeMs" },
            count: { $sum: 1 },
          },
        },
        { $sort: { avgResponseTime: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        routeStats,
        highLatencyRoutes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ 4. SUSPICIOUS ACTIVITY DETECTION
export const getSuspiciousActivity = async (req, res) => {
  try {
    const now = new Date();

    // 🔥 IP flood (last 1 min)
    const ipFlood = await RequestLog.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now - 60 * 1000) },
        },
      },
      {
        $group: {
          _id: "$ip",
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 100 } } },
    ]);

    // 🔥 error spikes (last 2 min)
    const errorSpike = await RequestLog.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now - 2 * 60 * 1000) },
          statusCode: { $gte: 400 },
        },
      },
      {
        $group: {
          _id: "$ip",
          errors: { $sum: 1 },
        },
      },
      { $match: { errors: { $gt: 20 } } },
    ]);

    res.json({
      success: true,
      ipFlood,
      errorSpike,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ 5. DELETE SINGLE
export const deleteRequestLog = async (req, res) => {
  try {
    const deleted = await RequestLog.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ 6. DELETE BULK
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

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ 7. EXPORT (you can extend with filters later)
export const exportRequestLogsNow = async (req, res) => {
  try {
    await exportRequestLogsAndEmail();

    res.json({
      success: true,
      message: "Export started",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};