import mongoose from "mongoose";
import Transaction from "../../models/transaction.model.js";

/**
 * 🔹 Build Match Filter (reusable)
 */
const buildMatchFilter = ({ familyId, userId, from, to, type }) => {
  if (!familyId) {
    throw new Error("familyId is missing");
  }

  const match = {
    family: new mongoose.Types.ObjectId(familyId),
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
 * ✅ FAMILY REPORT DATA (MAIN ONE)
 * ================================
 */
export const getFamilyReportData = async ({ familyId, from, to }) => {
  const match = buildMatchFilter({ familyId, from, to });

  const [summary, totalCounts, categoryStats] = await Promise.all([
    // 🔹 Summary
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),

    // 🔹 Total Transactions
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
        },
      },
    ]),

    // 🔹 Category Stats (WITH TYPE like your controller)
    Transaction.aggregate([
      { $match: match },
      { $unwind: "$category" },
      {
        $group: {
          _id: {
            category: "$category",
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          categoryId: "$category._id",
          name: "$category.name",
          type: "$_id.type",
          total: 1,
        },
      },
    ]),
  ]);

  /**
   * 🔹 Format Summary
   */
  const formattedSummary = {
    income: 0,
    expense: 0,
    investment: 0,
  };

  summary.forEach((item) => {
    formattedSummary[item._id] = item.totalAmount;
  });

  /**
   * 🔹 Group Category Stats (IMPORTANT)
   */
  const groupedCategoryStats = {
    income: [],
    expense: [],
    investment: [],
  };

  categoryStats.forEach((cat) => {
    if (groupedCategoryStats[cat.type]) {
      groupedCategoryStats[cat.type].push(cat);
    }
  });

  /**
   * 🔹 Derived Values
   */
  const balance =
    formattedSummary.income -
    formattedSummary.expense -
    formattedSummary.investment;

  const totalGains = balance + formattedSummary.investment;

  return {
    summary: {
      ...formattedSummary,
      balance,
      totalGains,
    },
    totalTransactions: totalCounts[0]?.totalTransactions || 0,
    categoryStats: groupedCategoryStats,
  };
};