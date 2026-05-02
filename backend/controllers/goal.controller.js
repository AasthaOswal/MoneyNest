import Goal from "../models/goal.model.js";

// ✅ CREATE GOAL
export const createGoal = async (req, res) => {
    try {
        console.log("inside create goal controller")
        const { title, type, goalType, goalMode, amount, period, startDate, endDate, scope, visibility } = req.body;

        const goal = new Goal({
            title,
            type,
            goalType,
            amount,
            period,
            owner: req.user._id,
            family: req.user.familyId,
        });

        console.log(goal)

        await goal.save();

        res.status(201).json({ success: true, goal });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// ✅ GET ALL GOALS (for family)
export const getAllGoals = async (req, res) => {
    try {
        console.log("inside get all goals controller")
        const goals = await Goal.find({
            family: req.user.familyId,
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, goals });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// ✅ GET GOAL BY ID
export const getGoalById = async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            family: req.user.familyId
        });

        if (!goal) {
            return res.status(404).json({ success: false, message: "Goal not found" });
        }

        // privacy check
        if (goal.visibility === "private" && goal.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        res.status(200).json({ success: true, goal });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// ✅ UPDATE GOAL --if a goal amount/type or such important parameters are updated then previous triggeredAlerts should be removed - if only title is updated then triggeredAlerts should not be removed 
export const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            family: req.user.familyId
        });

        if (!goal) {
            return res.status(404).json({ success: false, message: "Goal not found" });
        }

        // only creator can update
        if (goal.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        Object.assign(goal, req.body);
        await goal.save();

        res.status(200).json({ success: true, goal });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// ✅ DELETE GOAL
export const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            family: req.user.familyId,
            owner: req.user._id
        });

        if (!goal) {
            return res.status(404).json({ success: false, message: "Goal not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Goal deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};