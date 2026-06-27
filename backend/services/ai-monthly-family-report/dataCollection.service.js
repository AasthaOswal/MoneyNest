import mongoose from "mongoose";
import Family from "../../models/family.model.js";
import Transaction from "../../models/transaction.model.js";

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
    .map(month => {

        const preInvestmentSavings =
            month.income - month.expense;

        const netSavings =
            month.income -
            month.expense -
            month.investment;

        return {
            ...month,

            netSavings,

            preInvestmentSavings,

            netSavings,

            investmentRate:
                month.income === 0
                    ? 0
                    : Number(
                          (
                              month.investment /
                              month.income *
                              100
                          ).toFixed(2)
                      ),

            expenseToIncomeRatio:
                month.income === 0
                    ? 0
                    : Number(
                          (
                              month.expense /
                              month.income *
                              100
                          ).toFixed(2)
                      ),

            netSavingsRate:
                month.income === 0
                    ? 0
                    : Number(
                          (
                              netSavings /
                              month.income *
                              100
                          ).toFixed(2)
                      ),

            totalAllocationRate:
                month.income === 0
                    ? 0
                    : Number(
                          (
                              (
                                  month.expense +
                                  month.investment
                              ) /
                              month.income *
                              100
                          ).toFixed(2)
                      ),

            isOverAllocated:
                netSavings < 0,

            deficitAmount:
                netSavings < 0
                    ? Math.abs(netSavings)
                    : 0
        };
    });


    // =====================================
    // PREVIOUS MONTH CATEGORY
    // =====================================

    const previousMonthStart = new Date(
        reportMonthStart.getFullYear(),
        reportMonthStart.getMonth() - 1,
        1
    );

    const previousMonthEnd = new Date(
        reportMonthStart.getFullYear(),
        reportMonthStart.getMonth(),
        0,
        23,
        59,
        59,
        999
    );

    const previousMonthCategoryRaw =
        await Transaction.aggregate([
            {
                $match: {
                    family:
                        new mongoose.Types.ObjectId(
                            familyId
                        ),
                    type: "expense",
                    date: {
                        $gte: previousMonthStart,
                        $lte: previousMonthEnd
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
            },
            {
                $limit: 7
            }
        ]);

    const previousMonthCategoryMap = {};

    previousMonthCategoryRaw.forEach(item => {
        previousMonthCategoryMap[item._id] =
            item.amount;
    });


    // =====================================
    // CURRENT MONTH CATEGORY BREAKDOWN
    // =====================================

    const currentMonthCategoryRaw =
        await Transaction.aggregate([
            {
                $match: {
                    family:
                        new mongoose.Types.ObjectId(
                            familyId
                        ),
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
            },
            {
                $limit: 7
            }
        ]);

    const currentMonthTotalExpense =
        currentMonthCategoryRaw.reduce(
            (sum, item) =>
                sum + item.amount,
            0
        );

    const categoryInsightsData =
        currentMonthCategoryRaw.map(
            category => {

                const previousMonth =
                    previousMonthCategoryMap[
                        category._id
                    ] || 0;

                const changePercent =
                    previousMonth === 0
                        ? null
                        : Number(
                              (
                                  (
                                      category.amount -
                                      previousMonth
                                  ) /
                                  previousMonth *
                                  100
                              ).toFixed(2)
                          );

                return {
                    category:
                        category._id,

                    currentMonth:
                        category.amount,

                    previousMonth,

                    changePercent,

                    share:
                        currentMonthTotalExpense ===
                        0
                            ? 0
                            : Number(
                                  (
                                      category.amount /
                                      currentMonthTotalExpense *
                                      100
                                  ).toFixed(2)
                              )
                };
            }
        );


    // =====================================
    // MEMBER HISTORY
    // =====================================

    const memberHistoryRaw =
        await Transaction.aggregate([
            {
                $match: {
                    family:
                        new mongoose.Types.ObjectId(
                            familyId
                        ),
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
                        memberId:
                            "$user._id",

                        memberName:
                            "$user.name",

                        month: {
                            $dateToString:
                                {
                                    format:
                                        "%Y-%m",
                                    date:
                                        "$date",
                                    timezone:
                                        "Asia/Kolkata"
                                }
                        },

                        type: "$type"
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

    const monthTotalsMap = {};

monthlyTotals.forEach(month => {
    monthTotalsMap[month.month] = {
        income: month.income,
        expense: month.expense,
        investment: month.investment
    };
});

    const memberMap = {};

    memberHistoryRaw.forEach(item => {

        const member =
            item._id.memberName;

        const month =
            item._id.month;

        const type =
            item._id.type;

        if (!memberMap[member]) {
            memberMap[member] = {
                member,
                monthlyData: {}
            };
        }

        if (
            !memberMap[member]
                .monthlyData[month]
        ) {
            memberMap[
                member
            ].monthlyData[month] = {
                month,
                income: 0,
                expense: 0,
                investment: 0
            };
        }

        memberMap[member]
            .monthlyData[month][type] =
            item.amount;
    });
const memberHistory =
    Object.values(memberMap).map(
        member => ({

            member: member.member,

            monthlyData: Object.values(
                member.monthlyData
            )
                .sort(
                    (a, b) =>
                        a.month.localeCompare(
                            b.month
                        )
                )
                .map(monthData => {

                    const monthTotals =
                        monthTotalsMap[
                            monthData.month
                        ] || {};

                    const preInvestmentSavings = monthData.income - monthData.expense;

                    const netSavings = monthData.income - monthData.expense - monthData.investment;

                    return {

                        month:monthData.month,
                        memberIncome:monthData.income,
                        memberExpense:monthData.expense,
                        memberInvestment:monthData.investment,

                        incomeContributionPercent:
                            monthTotals.income
                                ? Number(
                                    (
                                        monthData.income /
                                        monthTotals.income *
                                        100
                                    ).toFixed(2)
                                )
                                : 0,

                        expenseContributionPercent:
                            monthTotals.expense
                                ? Number(
                                    (
                                        monthData.expense /
                                        monthTotals.expense *
                                        100
                                    ).toFixed(2)
                                )
                                : 0,

                        investmentContributionPercent:
                            monthTotals.investment
                                ? Number(
                                    (
                                        monthData.investment /
                                        monthTotals.investment *
                                        100
                                    ).toFixed(2)
                                )
                                : 0,

                        preInvestmentSavings,

                        netSavings,

                        investmentRate:
                            monthData.income === 0
                                ? 0
                                : Number(
                                    (
                                        monthData.investment /
                                        monthData.income *
                                        100
                                    ).toFixed(2)
                                ),

                        expenseToIncomeRatio:
                            monthData.income === 0
                                ? 0
                                : Number(
                                    (
                                        monthData.expense /
                                        monthData.income *
                                        100
                                    ).toFixed(2)
                                ),

                        netSavingsRate:
                            monthData.income === 0
                                ? 0
                                : Number(
                                    (
                                        netSavings /
                                        monthData.income *
                                        100
                                    ).toFixed(2)
                                ),

                        totalAllocationRate:
                            monthData.income === 0
                                ? 0
                                : Number(
                                    (
                                        (
                                            monthData.expense +
                                            monthData.investment
                                        ) /
                                        monthData.income *
                                        100
                                    ).toFixed(2)
                                ),

                        isOverAllocated:
                            netSavings < 0,

                        deficitAmount:
                            netSavings < 0
                                ? Math.abs(netSavings)
                                : 0
                    };
                })
        })
    );

    
    // throw new Error("Testing retry cron for ai monthly report email automation")

    return {

        familyName:
            family.familyName,

        reportMonth:
            formatMonth(
                reportMonthStart
            ),

        monthlyTotals,

        categoryInsightsDataTop7Categories:categoryInsightsData,

        memberHistory

    };
};