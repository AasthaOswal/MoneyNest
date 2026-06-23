import { COLORS } from "../styles/colors.js";

export const buildMemberSection = (
    reportData
) => {

    return [

        {
            text: "Member Performance",
            style: "sectionTitle"
        },

        {
            margin: [0, 0, 0, 10],
            text:
                "Financial contribution and savings performance of each family member."
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
                    "auto",
                    "auto",
                    "auto",
                    "auto",
                    "auto"
                ],

                body: [

                    [
                        {
                            text: "Member",
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
                            text: "Income Share",
                            style: "tableHeader"
                        }
                    ],

                    ...reportData.memberHistory.map(member => {

                        const latest =
                            member.monthlyData.at(-1);

                        return [

                            {
                                text: member.member,
                                style: "tableCell"
                            },

                            {
                                text: `₹${latest.memberIncome.toLocaleString()}`,
                                style: "tableCell",
                                color: COLORS.income
                            },

                            {
                                text: `₹${latest.memberExpense.toLocaleString()}`,
                                style: "tableCell",
                                color: COLORS.expense
                            },

                            {
                                text: `₹${latest.memberInvestment.toLocaleString()}`,
                                style: "tableCell",
                                color: COLORS.investment
                            },

                            {
                                text: `₹${latest.netSavings.toLocaleString()}`,
                                style: "tableCell",
                                color: COLORS.savings
                            },

                            {
                                text: `${latest.incomeContributionPercent}%`,
                                style: "tableCell"
                            }
                        ];
                    })
                ]
            }
        }
    ];
};