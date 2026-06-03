import ErrorLog from "../../models/admin/errorLog.model.js";
import mongoose from "mongoose";
import { getAllErrorsValidation } from "../../validators/admin/errorLog.validation.js";


// 1️⃣ Get all errors with filters --add search filter pagination to this
export const getAllErrors = async (req, res) => {
  try {
    const { error, value } = getAllErrorsValidation.validate(req.query);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    const {
      startDate,
      endDate,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    } = value;

    const filter = {};

    // Date Range
    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Global Search
    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(escapedSearch, "i");

      const numericSearch = Number(search);

      filter.$or = [
        { errorName: regex },
        { message: regex },

        { requestId: regex },

        { method: regex },
        { path: regex },

        { ip: regex },

        { severity: regex },
        { environment: regex },

        { errorFingerprint: regex },
      ];

      if (!Number.isNaN(numericSearch)) {
        filter.$or.push({
          occurrenceCount: numericSearch,
        });
      }
    }

    const skip = (page - 1) * limit;

    const sort = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [errors, totalRecords] = await Promise.all([
      ErrorLog.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(`
          errorName
          message
          requestId
          method
          path
          severity
          environment
          occurrenceCount
          isResolved
          firstOccurredAt
          lastOccurredAt
          createdAt
        `),

      ErrorLog.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      success: true,

      data: errors,

      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,

        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,

        nextPage:
          page < totalPages
            ? page + 1
            : null,

        previousPage:
          page > 1
            ? page - 1
            : null,
      },
    });
  } catch (error) {
    console.error("Get Errors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch error logs",
    });
  }
};

// 2️⃣ Get single error (detail view)
export const getErrorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const data = await ErrorLog.findById(id)
    .populate("resolvedBy", "name email")
    .populate("resolutionHistory.resolvedBy", "name email");

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

    if (!mongoose.Types.ObjectId.isValid(errorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid error ID",
      });
    }

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