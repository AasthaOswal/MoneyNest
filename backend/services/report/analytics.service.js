// import mongoose from "mongoose";
// import Transaction from "../../models/transaction.model.js";

// /**
//  * 🔹 Build Match Filter (reusable)
//  */
// const buildMatchFilter = ({ familyId, userId, from, to, type }) => {
//   if (!familyId) {
//     throw new Error("familyId is missing");
//   }

//   const match = {
//     family: new mongoose.Types.ObjectId(familyId),
//   };

//   if (userId) {
//     match.user = new mongoose.Types.ObjectId(userId);
//   }

//   if (type) {
//     match.type = type;
//   }

//   if (from || to) {
//     match.date = {};
//     if (from) match.date.$gte = new Date(from);
//     if (to) match.date.$lte = new Date(to);
//   }

//   return match;
// };

// /**
//  * ================================
//  * ✅ FAMILY REPORT DATA (MAIN ONE)
//  * ================================
//  */
// export const getFamilyReportData = async ({ familyId, from, to }) => {
//   const match = buildMatchFilter({ familyId, from, to });

//   const [summary, totalCounts, categoryStats] = await Promise.all([
//     // 🔹 Summary
//     Transaction.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: "$type",
//           totalAmount: { $sum: "$amount" },
//         },
//       },
//     ]),

//     // 🔹 Total Transactions
//     Transaction.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: null,
//           totalTransactions: { $sum: 1 },
//         },
//       },
//     ]),

//     // 🔹 Category Stats (WITH TYPE like your controller)
//     Transaction.aggregate([
//       { $match: match },
//       { $unwind: "$category" },
//       {
//         $group: {
//           _id: {
//             category: "$category",
//             type: "$type",
//           },
//           total: { $sum: "$amount" },
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "_id.category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: "$category" },
//       {
//         $project: {
//           _id: 0,
//           categoryId: "$category._id",
//           name: "$category.name",
//           type: "$_id.type",
//           total: 1,
//         },
//       },
//     ]),
//   ]);

//   /**
//    * 🔹 Format Summary
//    */
//   const formattedSummary = {
//     income: 0,
//     expense: 0,
//     investment: 0,
//   };

//   summary.forEach((item) => {
//     formattedSummary[item._id] = item.totalAmount;
//   });

//   /**
//    * 🔹 Group Category Stats (IMPORTANT)
//    */
//   const groupedCategoryStats = {
//     income: [],
//     expense: [],
//     investment: [],
//   };

//   categoryStats.forEach((cat) => {
//     if (groupedCategoryStats[cat.type]) {
//       groupedCategoryStats[cat.type].push(cat);
//     }
//   });

//   /**
//    * 🔹 Derived Values
//    */
//   const balance =
//     formattedSummary.income -
//     formattedSummary.expense -
//     formattedSummary.investment;

//   const totalGains = balance + formattedSummary.investment;

//   return {
//     summary: {
//       ...formattedSummary,
//       balance,
//       totalGains,
//     },
//     totalTransactions: totalCounts[0]?.totalTransactions || 0,
//     categoryStats: groupedCategoryStats,
//   };
// };


import mongoose from "mongoose";
import Transaction from "../../models/transaction.model.js";

/**
 * Helper to build match filter
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
 * FAMILY REPORT DATA
 * Same shape as dashboard analytics
 */
export const getFamilyReportData = async ({ familyId, from, to, userId, type }) => {
  const match = buildMatchFilter({ familyId, userId, from, to, type });

  const [
    summary,
    totalCounts,
    categoryStats,
    labelStats,
    contributions,
  ] = await Promise.all([
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]),

    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
        },
      },
    ]),

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
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
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

    Transaction.aggregate([
      { $match: match },
      { $unwind: "$labels" },
      {
        $group: {
          _id: "$labels",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "labels",
          localField: "_id",
          foreignField: "_id",
          as: "label",
        },
      },
      { $unwind: { path: "$label", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          labelId: "$label._id",
          name: "$label.name",
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]),

    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            user: "$user",
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.user",
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0],
            },
          },
          investment: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "investment"] }, "$total", 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          income: 1,
          expense: 1,
          investment: 1,
        },
      },
      { $sort: { income: -1, expense: -1, investment: -1 } },
    ]),
  ]);

  const formattedSummary = {
    income: 0,
    expense: 0,
    investment: 0,
  };

  summary.forEach((item) => {
    formattedSummary[item._id] = item.totalAmount || 0;
  });

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

  const totalIncome = formattedSummary.income;
  const totalExpense = formattedSummary.expense;
  const totalInvestment = formattedSummary.investment;

  const contributionsWithPercent = contributions.map((user) => ({
    ...user,
    incomePercent: totalIncome ? Number(((user.income / totalIncome) * 100).toFixed(2)) : 0,
    expensePercent: totalExpense ? Number(((user.expense / totalExpense) * 100).toFixed(2)) : 0,
    investmentPercent: totalInvestment ? Number(((user.investment / totalInvestment) * 100).toFixed(2)) : 0,
  }));

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
    labelStats,
    contributions: contributionsWithPercent,
  };
};