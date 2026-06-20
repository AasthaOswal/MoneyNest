export const buildFinanceOverviewSection =
    (reportData) => {

        return [

            {
                text:
                    "Monthly Trend",
                style:
                    "sectionTitle"
            },

            {
                table: {

                    widths: [
                        "*",
                        "*",
                        "*",
                        "*",
                        "*"
                    ],

                    body: [

                        [
                            "Month",
                            "Income",
                            "Expense",
                            "Investment",
                            "Savings"
                        ],

                        ...reportData.monthlyTotals
                            .map(row => [

                                row.month,

                                row.income,

                                row.expense,

                                row.investment,

                                row.savings
                            ])
                    ]
                }
            }
        ];
    };