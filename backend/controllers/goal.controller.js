import mongoose from "mongoose";
import Goal from "../models/goal.model.js";
import Transaction from "../models/transaction.model.js";
import { getDateRange } from "../utils/goals/getDateRange.js";
import { errorLogger } from "../utils/logger/errorLogger.js";
import calculateGoalProgress from "../services/goals/calculateGoalProgress.js"



// GET ALL GOALS FOR FAMILY
export const getAllGoals = async (req, res) => {
    try {
        const {
            visibility,
            status,
            type,
            goalType,
            search,
            sortBy = "createdAt",
            order = "desc",
        } = req.query;

        const query = {
            family: req.user.familyId,
        };

        // Visibility filter
        if (visibility === "family") {
            query.visibility = "family";
        } else if (visibility === "personal") {
            query.visibility = "personal";
            query.createdBy = req.user._id;
        } else {
            // Default: Family goals + user's personal goals
            query.$or = [
                { visibility: "family" },
                {
                    visibility: "personal",
                    createdBy: req.user._id,
                },
            ];
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        // Goal type filter
        if (goalType) {
            query.goalType = goalType;
        }

        // Transaction type filter
        if (type) {
            query.type = type;
        }

        // Search by title
        if (search) {
            query.title = {
                $regex: search,
                $options: "i",
            };
        }

        // Allowed sorting fields
        const allowedSortFields = [
            "createdAt",
            "endDate",
            "startDate",
            "amount",
            "title",
        ];

        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const sortOrder = order === "asc" ? 1 : -1;

        const goals = await Goal.find(query)
            .populate("family", "familyName")
            .populate("createdBy", "name email")
            .sort({
                [sortField]: sortOrder,
            });

        const goalsWithProgress = await Promise.all(
            goals.map(async (goal) => ({
                ...goal.toObject(),
                progress: await calculateGoalProgress(goal),
            }))
        );

        return res.status(200).json({
            success: true,
            count: goalsWithProgress.length,
            goals: goalsWithProgress,
        });
    } catch (error) {
        console.error("Get All Goals Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch goals.",
        });
    }
};

export const getGoalById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid goal id.",
            });
        }

        const goal = await Goal.findOne({
            _id: id,
            family: req.user.familyId,
            $or: [
                {
                    visibility: "family",
                },
                {
                    visibility: "personal",
                    createdBy: req.user._id,
                },
            ],
        })
            .populate("family", "familyName")
            .populate("createdBy", "name email");

            console.log("Goal: ", goal);

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found.",
            });
        }

        console.log("createdBy: ", goal.createdBy);
        console.log("req.user._id: ", req.user._id)

        if(goal.visibility === "personal" && goal.createdBy._id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "Perosnal goals can be accessed only by their creator.",
            });
        }

        const progress = await calculateGoalProgress(goal);

        return res.status(200).json({
            success: true,
            goal: {
                ...goal.toObject(),
                progress,
            },
        });
    } catch (error) {
        console.error("Get Goal By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch goal.",
        });
    }
};

// CREATE GOAL
export const createGoal = async (req, res) => {
    try {
        const {
            title,
            description,
            amount,
            startDate,
            endDate,
            type,
            goalType,
            visibility,
        } = req.body;

        const goal = await Goal.create({
            title,
            description,
            amount,
            startDate,
            endDate,
            type,
            goalType,
            visibility,
            family: req.user.familyId,
            createdBy: req.user._id,
        });

        const populatedGoal = await Goal.findById(goal._id)
            .populate("family", "familyName")
            .populate("createdBy", "name email");

        return res.status(201).json({
            success: true,
            message: "Goal created successfully.",
            goal: populatedGoal,
        });
    } catch (error) {
        console.error("Create Goal Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create goal.",
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
                message: "Invalid goal id.",
            });
        }

        const goal = await Goal.findOne({
            _id: id,
            family: req.user.familyId,
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found.",
            });
        }

        // Personal goal ownership
        if (
            goal.visibility === "personal" &&
            goal.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the creator can update this personal goal.",
            });
        }

        // Family goal ownership
        if (
            goal.visibility === "family" &&
            goal.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the creator can update this family goal.",
            });
        }

        Object.assign(goal, req.body);

        await goal.save();

        const updatedGoal = await Goal.findById(goal._id)
            .populate("family", "familyName")
            .populate("createdBy", "name email");

        const progress = await calculateGoalProgress(updatedGoal);

        return res.status(200).json({
            success: true,
            message: "Goal updated successfully.",
            goal: {
                ...updatedGoal.toObject(),
                progress,
            },
        });
    } catch (error) {
        console.error("Update Goal Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update goal.",
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
                message: "Invalid goal id.",
            });
        }

        const goal = await Goal.findOne({
            _id: id,
            family: req.user.familyId,
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found.",
            });
        }

        if (
            goal.visibility === "personal" &&
            goal.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the creator can delete this personal goal.",
            });
        }

        if (
            goal.visibility === "family" &&
            goal.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the creator can delete this family goal.",
            });
        }

        await goal.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Goal deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Goal Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete goal.",
        });
    }
};