export const buildSummarySection = (
    reportData,
    aiReport
) => {

    const summary =
        reportData.currentMonthSummary;

    return [

        {
            text: "Financial Overview",
            style: "sectionTitle"
        },

        {
            columns: [

                {
                    text: [
                        {
                            text: "Income\n",
                            bold: true
                        },
                        `₹${summary.income}`
                    ]
                },

                {
                    text: [
                        {
                            text: "Expenses\n",
                            bold: true
                        },
                        `₹${summary.expense}`
                    ]
                },

                {
                    text: [
                        {
                            text: "Savings\n",
                            bold: true
                        },
                        `₹${summary.savings}`
                    ]
                },

                {
                    text: [
                        {
                            text: "Investments\n",
                            bold: true
                        },
                        `₹${summary.investment}`
                    ]
                }
            ]
        },

        {
            margin: [0, 20, 0, 0],
            text:
                aiReport.reportSummary.summary
        }
    ];
};