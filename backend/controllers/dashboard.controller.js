import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";

/**
 * Helper to build match filter
 */
const buildMatchFilter = ({ familyId, userId, from, to, type }) => {

    if (!familyId) {
        throw new Error("familyId is missing in request");
    }
    const match = {
        family: new mongoose.Types.ObjectId(familyId)
    };

    if (userId) {
        match.user = new mongoose.Types.ObjectId(userId);
    }

    if (type) {
        match.type = type;
    }

    if (from || to) {
        match.date = {};
        if (from) match.date.$gte = new Date(from);
        if (to) match.date.$lte = new Date(to);
    }

    return match;
};

/**
 * ================================
 * 1️⃣ COMBINED DASHBOARD
 * ================================
 */
export const familyDashboardController = async (req, res) => {
  try {
    const familyId = req.user.familyId;
    const { from, to, type } = req.query;

    const match = buildMatchFilter({ familyId, from, to, type });

    const [
      summary,
      totalCounts,
      categoryStats,
      labelStats,
      contributions
    ] = await Promise.all([

      // 🔹 Summary (income, expense, investment)
      Transaction.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$type",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),

      // 🔹 Total transaction counts
      Transaction.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 }
          }
        }
      ]),

      // 🔹 Category-wise stats
      Transaction.aggregate([
        { $match: match },
        { $unwind: "$category" },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" }
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category"
          }
        },
        { $unwind: "$category" },
        {
          $project: {
            _id: 0,
            categoryId: "$category._id",
            name: "$category.name",
            total: 1
          }
        }
      ]),

      // 🔹 Label-wise stats
      Transaction.aggregate([
        { $match: match },
        { $unwind: "$labels" },
        {
          $group: {
            _id: "$labels",
            total: { $sum: "$amount" }
          }
        },
        {
          $lookup: {
            from: "labels",
            localField: "_id",
            foreignField: "_id",
            as: "label"
          }
        },
        { $unwind: "$label" },
        {
          $project: {
            _id: 0,
            labelId: "$label._id",
            name: "$label.name",
            total: 1
          }
        }
      ]),

      // 🔹 Contribution per user
      Transaction.aggregate([
        { $match: match },

        {
            $group: {
            _id: {
                user: "$user",
                type: "$type"
            },
            total: { $sum: "$amount" }
            }
        },

        {
            $group: {
            _id: "$_id.user",
            income: {
                $sum: {
                $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0]
                }
            },
            expense: {
                $sum: {
                $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0]
                }
            },
            investment: {
                $sum: {
                $cond: [{ $eq: ["$_id.type", "investment"] }, "$total", 0]
                }
            }
            }
        },

        {
            $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
            }
        },
        { $unwind: "$user" },

        {
            $project: {
            _id: 0,
            userId: "$user._id",
            name: "$user.name",
            income: 1,
            expense: 1,
            investment: 1
            }
        }
        ])
    ]);

    // 🔹 Convert summary into object
    const formattedSummary = {
      income: 0,
      expense: 0,
      investment: 0
    };

    summary.forEach(item => {
      formattedSummary[item._id] = item.totalAmount;
    });

    const totalIncome = formattedSummary.income;
    const totalExpense = formattedSummary.expense;
    const totalInvestment = formattedSummary.investment;

    const contributionsWithPercent = contributions.map(user => ({
    ...user,

    incomePercent: totalIncome
        ? ((user.income / totalIncome) * 100).toFixed(2)
        : 0,

    expensePercent: totalExpense
        ? ((user.expense / totalExpense) * 100).toFixed(2)
        : 0,

    investmentPercent: totalInvestment
        ? ((user.investment / totalInvestment) * 100).toFixed(2)
        : 0
    }));

    // 🔹 Derived values
    const balance =
      formattedSummary.income -
      formattedSummary.expense -
      formattedSummary.investment;

    const totalGains = balance + formattedSummary.investment;

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          ...formattedSummary,
          balance,
          totalGains
        },
        totalTransactions: totalCounts[0]?.totalTransactions || 0,
        categoryStats,
        labelStats,
        contributions:contributionsWithPercent
      }
    });

  } catch (error) {
    console.error("Combined Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load combined dashboard"
    });
  }
};

/**
 * ================================
 * 2️⃣ INDIVIDUAL DASHBOARD
 * ================================
 */
export const individualDashboardController = async (req, res) => {
  try {
    const familyId = req.user.familyId;
    const userId = req.user._id;

    const { from, to, type } = req.query;

    const match = buildMatchFilter({
      familyId,
      userId,
      from,
      to,
      type
    });

    const [
      summary,
      totalCounts,
      categoryStats,
      labelStats
    ] = await Promise.all([

      // 🔹 Summary
      Transaction.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$type",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),

      // 🔹 Total count
      Transaction.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 }
          }
        }
      ]),

      // 🔹 Category stats
      Transaction.aggregate([
        { $match: match },
        { $unwind: "$category" },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" }
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category"
          }
        },
        { $unwind: "$category" },
        {
          $project: {
            _id: 0,
            categoryId: "$category._id",
            name: "$category.name",
            total: 1
          }
        }
      ]),

      // 🔹 Label stats
      Transaction.aggregate([
        { $match: match },
        { $unwind: "$labels" },
        {
          $group: {
            _id: "$labels",
            total: { $sum: "$amount" }
          }
        },
        {
          $lookup: {
            from: "labels",
            localField: "_id",
            foreignField: "_id",
            as: "label"
          }
        },
        { $unwind: "$label" },
        {
          $project: {
            _id: 0,
            labelId: "$label._id",
            name: "$label.name",
            total: 1
          }
        }
      ])
    ]);

    // 🔹 Format summary
    const formattedSummary = {
      income: 0,
      expense: 0,
      investment: 0
    };

    summary.forEach(item => {
      formattedSummary[item._id] = item.totalAmount;
    });

    const balance =
      formattedSummary.income -
      formattedSummary.expense -
      formattedSummary.investment;

    const totalGains = balance + formattedSummary.investment;

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          ...formattedSummary,
          balance,
          totalGains
        },
        totalTransactions: totalCounts[0]?.totalTransactions || 0,
        categoryStats,
        labelStats
      }
    });

  } catch (error) {
    console.error("Individual Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load individual dashboard"
    });
  }
};