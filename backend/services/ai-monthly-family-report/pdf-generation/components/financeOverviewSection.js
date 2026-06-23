import { COLORS } from "../styles/colors.js";

export const buildFinanceOverviewSection = (
    reportData
) => {

    return [

        {
            text: "Financial Trend Analysis",
            style: "sectionTitle"
        },

        {
            margin: [0, 0, 0, 10],
            text:
                "Historical 3 months performance of the family."
        },

        {
            layout: {

                fillColor: (rowIndex) => {
                    if (rowIndex === 0) {
                        return COLORS.surface3;
                    }

                    return COLORS.surface;
                },

                hLineColor: () => COLORS.border,
                vLineColor: () => COLORS.border,

                hLineWidth: (i) => i === 1 ? 1.2 : 0.6,
                vLineWidth: () => 0.6,

                paddingLeft: () => 10,
                paddingRight: () => 10,
                paddingTop: () => 8,
                paddingBottom: () => 8
            },

            table: {

                headerRows: 1,

                widths: [
                    "auto",
                    "*",
                    "*",
                    "*",
                    "*",
                    "auto",
                    "auto"
                ],

                body: [

                    [
                        {
                            text: "Month",
                            style: "tableHeader"
                        },
                        {
                            text: "Income",
                            style: "tableHeader"
                        },
                        {
                            text: "Expense",
                            style: "tableHeader"
                        },
                        {
                            text: "Investment",
                            style: "tableHeader"
                        },
                        {
                            text: "Net Savings",
                            style: "tableHeader"
                        },
                        {
                            text: "Net Savings Rate",
                            style: "tableHeader"
                        },
                        {
                            text: "Expense to Income Ratio",
                            style: "tableHeader"
                        }
                    ],

                    ...reportData.monthlyTotals.map(row => [

                        {
                            text: row.month,
                            style: "tableCell"
                        },

                        {
                            text: `₹${row.income.toLocaleString()}`,
                            style: "tableCell",
                            color: COLORS.income,
                        },

                        {
                            text: `₹${row.expense.toLocaleString()}`,
                            style: "tableCell",
                            color: COLORS.expense,
                        },

                        {
                            text: `₹${row.investment.toLocaleString()}`,
                            style: "tableCell",
                            color: COLORS.investment,
                        },

                        {
                            text: `₹${row.netSavings.toLocaleString()}`,
                            style: "tableCell",
                            color: COLORS.savings,
                        },

                        {
                            text: `${row.netSavingsRate}%`,
                            style: "tableCell",
                        },

                        {
                            text: `${row.expenseToIncomeRatio}`,
                            style: "tableCell",
                        }
                    ])
                ]
            }
        }
    ];
};