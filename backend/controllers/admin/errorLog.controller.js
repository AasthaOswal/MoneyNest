import ErrorLog from "../../models/admin/errorLog.model.js";
import mongoose from "mongoose";


// 1️⃣ Get all errors with filters
export const getAllErrors = async (req, res) => {
  try {
    const { severity, startDate, endDate, search } = req.query;

    let filter = {};

    if (severity) filter.severity = severity;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { message: { $regex: search, $options: "i" } },
        { errorName: { $regex: search, $options: "i" } },
        { path: { $regex: search, $options: "i" } },
      ];
    }

    const data = await ErrorLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 2️⃣ Get single error (detail view)
export const getErrorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const data = await ErrorLog.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Error not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 3️⃣ Error grouping (Top recurring errors 🔥)
export const getErrorStats = async (req, res) => {
  try {
    const data = await ErrorLog.aggregate([
      {
        $group: {
          _id: {
            message: "$message",
            path: "$path",
          },
          count: { $sum: 1 },
          lastOccurred: { $max: "$createdAt" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 4️⃣ Critical errors (for dashboard)
export const getCriticalErrors = async (req, res) => {
  try {
    const data = await ErrorLog.find({ severity: "critical" })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 5️⃣ Errors by requestId (trace debugging 🔥)
export const getErrorsByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ message: "requestId is required" });
    }

    const data = await ErrorLog.find({ requestId }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
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



export const resolveError = async (req, res) => {
  try {
    const { errorId } = req.params;

    const existingError = await ErrorLog.findById(errorId).select("isResolved");

    if (!existingError) {
      return res.status(404).json({
        success: false,
        message: "Error not found",
      });
    }

    if (existingError.isResolved) {
      return res.status(400).json({
        success: false,
        message: "Error is already resolved",
      });
    }

    const error = await ErrorLog.findByIdAndUpdate(
      errorId,
      {
        isResolved: true,

        resolvedAt: new Date(),
        resolvedBy: req.user._id,

        $push: {
          resolutionHistory: {
            resolvedAt: new Date(),
            resolvedBy: req.user._id,
          },
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (!error) {
      return res.status(404).json({
        success: false,
        message: "Error not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Error marked as resolved",
      error,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};