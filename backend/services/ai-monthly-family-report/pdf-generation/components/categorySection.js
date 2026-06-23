import { COLORS } from "../styles/colors.js";

export const buildCategorySection = (
    reportData
) => {

    return [

        {
            text: "Top Spending Categories",
            style: "sectionTitle"
        },

        {
            margin: [0, 0, 0, 10],
            text:
                "Highest spending categories and their month-over-month movement."
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
                    "auto"
                ],

                body: [

                    [
                        {
                            text: "Category",
                            style: "tableHeader"
                        },
                        {
                            text: "Current",
                            style: "tableHeader"
                        },
                        {
                            text: "Previous",
                            style: "tableHeader"
                        },
                        {
                            text: "Change %",
                            style: "tableHeader"
                        },
                        {
                            text: "Share %",
                            style: "tableHeader"
                        }
                    ],

                    ...reportData
                        .categoryInsightsDataTop7Categories
                        .map(category => [

                            {
                                text: category.category,
                                style: "tableCell"
                            },

                            {
                                text: `₹${category.currentMonth.toLocaleString()}`,
                                style: "tableCell",
                                color: COLORS.expense
                            },

                            {
                                text: `₹${category.previousMonth.toLocaleString()}`,
                                style: "tableCell"
                            },

                            {
                                text:
                                    category.changePercent === null
                                        ? "New"
                                        : `${category.changePercent}%`,
                                style: "tableCell",
                                color:
                                    category.changePercent > 0
                                        ? COLORS.expense
                                        : COLORS.savings
                            },

                            {
                                text: `${category.share}%`,
                                style: "tableCell"
                            }
                        ])
                ]
            }
        }
    ];
};