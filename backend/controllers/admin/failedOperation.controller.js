import FailedOperation from "../../models/admin/failedOperation.model.js";
import { retrySingleOperation } from "../../services/retry/retrySingleFailedOperation.service.js";
import { getFailedOperationsValidation } from "../../validators/admin/failedOperation.validation.js";


export const getFailedOperations = async (req, res) => {
  try {
    const { error, value } =
      getFailedOperationsValidation.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    const {
      type,
      status,
      requestId,
      search,
      startDate,
      endDate,
      page,
      limit,
      sortBy,
      sortOrder,
    } = value;

    const filter = {};

    if (type) filter.operationType = type;

    if (status) filter.status = status;

    if (requestId) filter.requestId = requestId;

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        filter.createdAt.$lte = end;
      }
    }

    if (search) {
      const regex = new RegExp(search, "i");

      filter.$or = [
        { operationType: regex },
        { status: regex },
        { requestId: regex },
        { "error.message": regex },
      ];
    }

    const skip = (page - 1) * limit;

    const sort = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [data, total] = await Promise.all([
      FailedOperation.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      FailedOperation.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data,

      pagination: {
        total,
        currentPage:page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      
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
      resetRetryCount: true, //THIS LINE
    });

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFailedOperationById = async (req,res) =>{
  try {
    const {id} = req.params;

    const op = await FailedOperation.findById(id);

    if(!op){
      return res.status(404).json({success:true, message:"Failed Operation NOt Found"});
    }

    return res.status(200).json({success: "Failed Operation found successfully", data:op});
  } catch (error) {
    res.status(500).json({success:false, message: "Server Error"});
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