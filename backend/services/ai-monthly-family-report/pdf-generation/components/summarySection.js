import { COLORS } from "../styles/colors.js"

const buildMetricCard = (
    title,
    value,
    color
) => ({

    table: {

        widths: ["*"],

        body: [[{

            stack: [

                {
                    text: title,
                    style: "metricLabel"
                },

                {
                    text: value,
                    style: "metricValue",
                    color
                }
            ]
        }]]
    },

    layout: {

        fillColor: () => COLORS.surface2,

        hLineColor: () => COLORS.border,
        vLineColor: () => COLORS.border,

        hLineWidth: () => 1,
        vLineWidth: () => 1,

        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 12,
        paddingBottom: () => 12
    }
});

export const buildSummarySection = (
    reportData,
    aiReport
) => {

    const summary =
        reportData.monthlyTotals.at(-1);

    return [

        {
            text: "Financial Overview",
            style: "sectionTitle"
        },

        {
    columns: [

        buildMetricCard(
            "Income",
            `₹${summary.income.toLocaleString()}`,
            COLORS.income
        ),

        buildMetricCard(
            "Expenses",
            `₹${summary.expense.toLocaleString()}`,
            COLORS.expense
        ),

        buildMetricCard(
            "Investments",
            `₹${summary.investment.toLocaleString()}`,
            COLORS.investment
        ),

        buildMetricCard(
            "Income to Expense Ratio",
            `${summary.expenseToIncomeRatio}%`,
            COLORS.expense
        ),

        
    ],

    columnGap: 10
},

{
    margin: [0, 10, 0, 0],

    columns: [

        buildMetricCard(
            "Pre Investment Savings",
            `${summary.preInvestmentSavings}%`,
            COLORS.savings
        ),

        buildMetricCard(
            "Net Savings",
            `₹${summary.netSavings.toLocaleString()}`,
            COLORS.savings
        ),

        buildMetricCard(
            "Net Savings Rate",
            `${summary.netSavingsRate}%`,
            COLORS.savings
        ),

        

        buildMetricCard(
            "Investment Rate",
            `${summary.investmentRate}%`,
            COLORS.investment
        )
    ],

    columnGap: 10
}
    ];
};