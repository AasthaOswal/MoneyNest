import mongoose from "mongoose";
import Family from "../../models/family.model.js";
import Transaction from "../../models/transaction.model.js";
import User from "../../models/user.model.js";
import Category from "../../models/category.model.js";

const formatMonth = (date) =>
    `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}`;

export const buildMonthlyReportData = async ({
    familyId,
    reportMonthDate = new Date()
}) => {


    const family = await Family.findById(familyId)
        .select("familyName")
        .lean();

    if (!family) {
        throw new Error("Family not found");
    }

    // Example:
    // If report runs on June 1st
    // We generate report for May

    const reportMonthStart = new Date(
        reportMonthDate.getFullYear(),
        reportMonthDate.getMonth() - 1,
        1
    );

    const reportMonthEnd = new Date(
        reportMonthDate.getFullYear(),
        reportMonthDate.getMonth(),
        0,
        23,
        59,
        59,
        999
    );

    const threeMonthsAgo = new Date(
        reportMonthStart.getFullYear(),
        reportMonthStart.getMonth() - 2,
        1
    );

    // =====================================
    // MONTHLY TOTALS
    // =====================================

    const monthlyTotalsRaw = await Transaction.aggregate([
        {
            $match: {
                family: new mongoose.Types.ObjectId(familyId),
                date: {
                    $gte: threeMonthsAgo,
                    $lte: reportMonthEnd
                }
            }
        },
        {
            $group: {
                _id: {
                    month: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$date",
                            timezone: "Asia/Kolkata"
                        }
                    },
                    type: "$type"
                },
                total: {
                    $sum: "$amount"
                }
            }
        }
    ]);

    const monthlyMap = {};

    monthlyTotalsRaw.forEach(item => {

        const month = item._id.month;

        if (!monthlyMap[month]) {
            monthlyMap[month] = {
                month,
                income: 0,
                expense: 0,
                investment: 0
            };
        }

        monthlyMap[month][item._id.type] = item.total;
    });

    const monthlyTotals = Object.values(monthlyMap)
        .sort((a, b) => a.month.localeCompare(b.month))
        .map(month => ({
            ...month,
            savings: (month.income - month.expense - month.investment)
        }));


    const currentMonthSummary =
    monthlyTotals.find(
        month =>
            month.month ===
            formatMonth(reportMonthStart)
    ) ?? null;


    // =====================================
    // CATEGORY HISTORY
    // =====================================

    const categoryRaw = await Transaction.aggregate([
        {
            $match: {
                family: new mongoose.Types.ObjectId(familyId),
                type: "expense",
                date: {
                    $gte: threeMonthsAgo,
                    $lte: reportMonthEnd
                }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $group: {
                _id: {
                    category: "$category.name",
                    month: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$date",
                            timezone: "Asia/Kolkata"
                        }
                    }
                },
                amount: {
                    $sum: "$amount"
                }
            }
        },
        {
            $sort: {
                "_id.month": 1
            }
        }
    ]);

    const categoryMap = {};

    categoryRaw.forEach(item => {

        const category = item._id.category;

        if (!categoryMap[category]) {
            categoryMap[category] = {
                category,
                monthlyAmounts: []
            };
        }

        categoryMap[category].monthlyAmounts.push({
            month: item._id.month,
            amount: item.amount
        });
    });

    const categoryHistory = Object.values(categoryMap);

    // =====================================
    // CURRENT MONTH CATEGORY BREAKDOWN
    // =====================================

    const currentMonthCategoryRaw = await Transaction.aggregate([
        {
            $match: {
                family: new mongoose.Types.ObjectId(familyId),
                type: "expense",
                date: {
                    $gte: reportMonthStart,
                    $lte: reportMonthEnd
                }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $group: {
                _id: "$category.name",
                amount: {
                    $sum: "$amount"
                }
            }
        },
        {
            $sort: {
                amount: -1
            }
        }
    ]);

    const currentMonthTotalExpense =
        currentMonthCategoryRaw.reduce(
            (sum, item) => sum + item.amount,
            0
        );

    const currentMonthCategoryBreakdown =
        currentMonthCategoryRaw.map(item => ({
            category: item._id,
            amount: item.amount,
            share:
                currentMonthTotalExpense === 0
                    ? 0
                    : Number(
                        (
                            item.amount /
                            currentMonthTotalExpense *
                            100
                        ).toFixed(2)
                    )
        }));


    // =====================================
    // MEMBER HISTORY
    // =====================================

    const memberRaw = await Transaction.aggregate([
        {
            $match: {
                family: new mongoose.Types.ObjectId(familyId),
                type: "expense",
                date: {
                    $gte: threeMonthsAgo,
                    $lte: reportMonthEnd
                }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $group: {
                _id: {
                    memberId: "$user._id",
                    memberName: "$user.name",
                    month: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$date",
                            timezone: "Asia/Kolkata"
                        }
                    }
                },
                amount: {
                    $sum: "$amount"
                }
            }
        },
        {
            $sort: {
                "_id.month": 1
            }
        }
    ]);


    // Build month total expenses
    const expensePerMonth = {};

    monthlyTotals.forEach(month => {
        expensePerMonth[month.month] = month.expense;
    });

    const memberMap = {};

    memberRaw.forEach(item => {

        const member = item._id.memberName;

        if (!memberMap[member]) {
            memberMap[member] = {
                member,
                monthlyAmounts: []
            };
        }

        const monthExpense =
            expensePerMonth[item._id.month] || 0;

        const shareOfFamilyExpense = monthExpense === 0 ? 0 : Number((item.amount / monthExpense) * 100).toFixed(2);

        memberMap[member].monthlyAmounts.push({
            month: item._id.month,
            amount: item.amount,
            shareOfFamilyExpense: Number(shareOfFamilyExpense)
        });
    });

    const memberHistory = Object.values(memberMap);



    const topTransactionsRaw = await Transaction.find({
        family: familyId,
        type: "expense",
        date: {
            $gte: reportMonthStart,
            $lte: reportMonthEnd
        }
    }).populate("user", "name").populate("category", "name").sort({ amount: -1 }).limit(10).lean();

    const categoryExpenseMap = {};

    currentMonthCategoryBreakdown.forEach(category => {
        categoryExpenseMap[category.category] =
            category.amount;
    });


    const totalFamilyExpense = currentMonthTotalExpense;

    const topTransactions = topTransactionsRaw.map(txn => {

        const categoryName =
            txn.category?.name ?? "Unknown";

        const categoryExpense =
            categoryExpenseMap[categoryName] ?? 0;

        return {
            title: txn.title,

            amount: txn.amount,

            category: categoryName,

            date:  txn.date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata"}),

            member: txn.user?.name ?? "Unknown",

            percentOfCategory: categoryExpense === 0 ? 0 : Number((txn.amount / categoryExpense * 100).toFixed(2)),

            percentOfTotalExpense: totalFamilyExpense === 0 ? 0 : Number((txn.amount / totalFamilyExpense * 100).toFixed(2))
        };
    });
    return {
        familyName: family.familyName,
        reportMonth: formatMonth(reportMonthStart),

        currentMonthSummary,

        monthlyTotals,

        categoryHistory,

        currentMonthCategoryBreakdown,

        memberHistory,

        topTransactions
    };

};