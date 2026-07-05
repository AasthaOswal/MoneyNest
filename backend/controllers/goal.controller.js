import mongoose from "mongoose";
import Goal from "../models/goal.model.js";
import Transaction from "../models/transaction.model.js";
import { getDateRange } from "../utils/goals/getDateRange.js";
import { errorLogger } from "../utils/logger/errorLogger.js";

const getProgressForGoal = async (goal) => {
  const { start, end } = getDateRange(goal.period);

  const totalResult = await Transaction.aggregate([
    {
      $match: {
        family: new mongoose.Types.ObjectId(goal.family),
        type: goal.type,
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const achievedAmount = totalResult?.[0]?.totalAmount || 0;
  const targetAmount = goal.amount || 0;

  const progressPercent =
    targetAmount > 0 ? Number(((achievedAmount / targetAmount) * 100).toFixed(2)) : 0;

  const remainingAmount = Math.max(targetAmount - achievedAmount, 0);

  let calculatedStatus = "active";
  if (goal.goalType === "target") {
    if (progressPercent >= 100) calculatedStatus = "completed";
  } else if (goal.goalType === "limit") {
    if (progressPercent >= 100) calculatedStatus = "failed";
  }

  return {
    achievedAmount,
    targetAmount,
    progressPercent,
    remainingAmount,
    calculatedStatus,
    isOverLimit: goal.goalType === "limit" ? achievedAmount >= targetAmount : false,
    isCompleted: goal.goalType === "target" ? achievedAmount >= targetAmount : false,
  };
};

// CREATE GOAL
export const createGoal = async (req, res) => {
  try {
    const { title, type, goalType, startDate, endDate, amount, visibility } = req.body;

    if (!req.user?.familyId || !req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const goal = await Goal.create({
      title,
      type,
      goalType,
      startDate,
      endDate,
      visibility,
      amount,
      family: req.user.familyId,
      createdBy: req.user._id,
    });

    // const progress = await getProgressForGoal(goal);

    return res.status(201).json({
      success: true,
      goal: {
        ...goal.toObject(),
      },
    });
  } catch (err) {
    await errorLogger({
      error: err,
      req,
      severity: "high",
    });

    console.log(err)

    return res.status(500).json({
      success: false,
      message: "Failed to create goal",
    });
  }
};

// GET ALL GOALS FOR FAMILY
export const getAllGoals = async (req, res) => {
  try {
    if (!req.user?.familyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const goals = await Goal.find({
      family: req.user.familyId,
    }).sort({ createdAt: -1 });

    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const progress = await getProgressForGoal(goal);
        return {
          ...goal.toObject(),
          progress,
        };
      })
    );

    return res.status(200).json({
      success: true,
      goals: goalsWithProgress,
    });
  } catch (err) {
    await errorLogger({
      error: err,
      req,
      severity: "high",
    });

    return res.status(500).json({
      success: false,
      message: "Failed to fetch goals",
    });
  }
};

// GET GOAL BY ID
export const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid goal id",
      });
    }

    const goal = await Goal.findOne({
      _id: id,
      family: req.user.familyId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const progress = await getProgressForGoal(goal);

    return res.status(200).json({
      success: true,
      goal: {
        ...goal.toObject(),
        progress,
      },
    });
  } catch (err) {
    await errorLogger({
      error: err,
      req,
      severity: "high",
    });

    return res.status(500).json({
      success: false,
      message: "Failed to fetch goal",
    });
  }
};

// UPDATE GOAL
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid goal id",
      });
    }

    const goal = await Goal.findOne({
      _id: id,
      family: req.user.familyId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    // only owner can update
    if (goal.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can update this goal",
      });
    }

    const allowedFields = ["title", "type", "goalType", "period", "amount", "status"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        goal[field] = req.body[field];
      }
    }

    await goal.save();

    const progress = await getProgressForGoal(goal);

    return res.status(200).json({
      success: true,
      goal: {
        ...goal.toObject(),
        progress,
      },
    });
  } catch (err) {
    await errorLogger({
      error: err,
      req,
      severity: "high",
    });

    return res.status(500).json({
      success: false,
      message: "Failed to update goal",
    });
  }
};

// DELETE GOAL
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid goal id",
      });
    }

    const goal = await Goal.findOne({
      _id: id,
      family: req.user.familyId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    // only owner can delete
    if (goal.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can delete this goal",
      });
    }

    await Goal.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (err) {
    await errorLogger({
      error: err,
      req,
      severity: "high",
    });

    return res.status(500).json({
      success: false,
      message: "Failed to delete goal",
    });
  }
};