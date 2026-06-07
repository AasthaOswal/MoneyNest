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
    //   Transaction.aggregate([
    //     { $match: match },
    //     { $unwind: "$category" },
    //     {
    //       $group: {
    //         _id: "$category",
    //         total: { $sum: "$amount" }
    //       }
    //     },
    //     {
    //       $lookup: {
    //         from: "categories",
    //         localField: "_id",
    //         foreignField: "_id",
    //         as: "category"
    //       }
    //     },
    //     { $unwind: "$category" },
    //     {
    //       $project: {
    //         _id: 0,
    //         categoryId: "$category._id",
    //         name: "$category.name",
    //         total: 1
    //       }
    //     }
    //   ]),
      Transaction.aggregate([
  { $match: match },
  { $unwind: "$category" },
  {
    $group: {
      _id: {
        category: "$category",
        type: "$type"   // ✅ ADD THIS
      },
      total: { $sum: "$amount" }
    }
  },
  {
    $lookup: {
      from: "categories",
      localField: "_id.category",
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
      type: "$_id.type",   // ✅ RETURN TYPE
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

    const groupedCategoryStats = {
  income: [],
  expense: [],
  investment: []
};

categoryStats.forEach(cat => {
  if (groupedCategoryStats[cat.type]) {
    groupedCategoryStats[cat.type].push(cat);
  }
});


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
        categoryStats: groupedCategoryStats,
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


export const getTrendsSummary = async (req, res) => {
  try {
    const { familyId } = req.user;

    const now = new Date();

    // 🔥 DATE RANGES
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 🔥 COMMON MATCH
    const matchStage = {
      family: new mongoose.Types.ObjectId(familyId)
    };

    // =========================
    // 🔹 1. TIME BASED SUMMARY
    // =========================
    const summary = await Transaction.aggregate([
      { $match: matchStage },

      {
        $facet: {
          today: [
            { $match: { date: { $gte: startOfToday } } },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" }
              }
            }
          ],

          week: [
            { $match: { date: { $gte: startOfWeek } } },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" }
              }
            }
          ],

          month: [
            { $match: { date: { $gte: startOfMonth } } },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" }
              }
            }
          ],

          year: [
            { $match: { date: { $gte: startOfYear } } },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" }
              }
            }
          ]
        }
      }
    ]);

    // =========================
    // 🔹 2. MONTHLY BREAKDOWN
    // =========================
    const monthly = await Transaction.aggregate([
      {
        $match: {
          ...matchStage,
          date: { $gte: startOfYear }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          data: {
            $push: {
              type: "$_id.type",
              total: "$total"
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // =========================
    // 🔹 3. USER CONTRIBUTION
    // =========================
    const userContribution = await Transaction.aggregate([
      { $match: matchStage },

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
          types: {
            $push: {
              type: "$_id.type",
              total: "$total"
            }
          },
          totalAmount: { $sum: "$total" }
        }
      }
    ]);

    // =========================
    // 🔹 4. TOTAL FOR PERCENTAGE
    // =========================
    const totalAll = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const grandTotal = totalAll[0]?.total || 0;

    // 🔥 ADD PERCENTAGE
    const userContributionWithPercent = userContribution.map(u => ({
      ...u,
      percentage: grandTotal
        ? ((u.totalAmount / grandTotal) * 100).toFixed(2)
        : 0
    }));

    // =========================
    // FINAL RESPONSE
    // =========================
    res.json({
      success: true,
      data: {
        summary: summary[0],
        monthly,
        userContribution: userContributionWithPercent
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching trends"
    });
  }
};

export const getYearlyTrends = async (req, res) => {
  try {
    const { familyId } = req.user;

    const year = Number(req.query.year) || new Date().getFullYear();

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const trends = await Transaction.aggregate([
      {
        $match: {
          family: familyId,
          date: {
            $gte: startDate,
            $lt: endDate
          }
        }
      },

      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type"
          },
          total: {
            $sum: "$amount"
          }
        }
      }
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    const formatted = months.map((month, index) => ({
      month,
      income: 0,
      expense: 0,
      investment: 0
    }));

    trends.forEach((item) => {
      const monthIndex = item._id.month - 1;

      formatted[monthIndex][item._id.type] = item.total;
    });

    return res.status(200).json({
      success: true,
      data: formatted
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trends"
    });
  }
};


export const getMonthlyAnalytics = async (req, res) => {
  try {
    const { familyId } = req.user;

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year required",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const matchStage = {
      family: familyId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    // ==========================
    // SUMMARY
    // ==========================

    const summaryResult = await Transaction.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: "$type",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const summary = {
      income: 0,
      expense: 0,
      investment: 0,
    };

    summaryResult.forEach((item) => {
      summary[item._id] = item.total;
    });

    // ==========================
    // CATEGORY DISTRIBUTION
    // ==========================

    const categoryResult = await Transaction.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: {
            type: "$type",
            category: "$category.name",
          },
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    const categoryDistribution = {
      income: [],
      expense: [],
      investment: [],
    };

    categoryResult.forEach((item) => {
      const type = item._id.type;

      if (categoryDistribution[type]) {
        categoryDistribution[type].push({
          name: item._id.category,
          amount: item.total,
        });
      }
    });

    // ==========================
    // USER DISTRIBUTION
    // ==========================

    const userResult = await Transaction.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $group: {
          _id: {
            type: "$type",
            user: "$user.name",
          },
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    const userDistribution = {
      income: [],
      expense: [],
      investment: [],
    };

    userResult.forEach((item) => {
      const type = item._id.type;

      if (userDistribution[type]) {
        userDistribution[type].push({
          name: item._id.user,
          amount: item.total,
        });
      }
    });

    // ==========================
    // RESPONSE
    // ==========================

    return res.status(200).json({
      success: true,
      summary,
      categoryDistribution,
      userDistribution,
    });
  } catch (error) {
    console.error("Monthly Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

// export const getMonthlyAnalytics = async (req, res) => {
//   try {
//     const { familyId } = req.user;

//     const month = Number(req.query.month);
//     const year = Number(req.query.year);

//     if (!month || !year) {
//       return res.status(400).json({
//         success: false,
//         message: "Month and year required"
//       });
//     }

//     const startDate = new Date(year, month - 1, 1);

//     const endDate = new Date(year, month, 1);

//     // ==========================
//     // SUMMARY
//     // ==========================

//     const summary = await Transaction.aggregate([
//       {
//         $match: {
//           family: familyId,
//           date: {
//             $gte: startDate,
//             $lt: endDate
//           }
//         }
//       },

//       {
//         $group: {
//           _id: "$type",
//           total: {
//             $sum: "$amount"
//           }
//         }
//       }
//     ]);

//     // ==========================
//     // CATEGORY DISTRIBUTION
//     // ==========================

//     const categoryDistribution = await Transaction.aggregate([
//       {
//         $match: {
//           family: familyId,
//           date: {
//             $gte: startDate,
//             $lt: endDate
//           }
//         }
//       },

//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "category"
//         }
//       },

//       {
//         $unwind: "$category"
//       },

//       {
//         $group: {
//           _id: {
//             type: "$type",
//             category: "$category.name"
//           },
//           total: {
//             $sum: "$amount"
//           }
//         }
//       }
//     ]);

//     // ==========================
//     // USER DISTRIBUTION
//     // ==========================

//     const userDistribution = await Transaction.aggregate([
//       {
//         $match: {
//           family: familyId,
//           date: {
//             $gte: startDate,
//             $lt: endDate
//           }
//         }
//       },

//       {
//         $lookup: {
//           from: "users",
//           localField: "user",
//           foreignField: "_id",
//           as: "user"
//         }
//       },

//       {
//         $unwind: "$user"
//       },

//       {
//         $group: {
//           _id: {
//             type: "$type",
//             user: "$user.name"
//           },
//           total: {
//             $sum: "$amount"
//           }
//         }
//       }
//     ]);

//     return res.status(200).json({
//       success: true,
//       summary,
//       categoryDistribution,
//       userDistribution
//     });

//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch analytics"
//     });
//   }
// };