export const buildCategorySection =
    (reportData) => {

        return [

            {
                text:
                    "Expense Breakdown",
                style:
                    "sectionTitle"
            },

            {
                table: {

                    widths: [
                        "*",
                        "auto",
                        "auto"
                    ],

                    body: [

                        [
                            "Category",
                            "Amount",
                            "%"
                        ],

                        ...reportData
                            .currentMonthCategoryBreakdown
                            .map(c => [

                                c.category,

                                `₹${c.amount}`,

                                `${c.share}%`
                            ])
                    ]
                }
            }
        ];
    };