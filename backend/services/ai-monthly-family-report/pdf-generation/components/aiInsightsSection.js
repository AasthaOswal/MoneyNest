const severityStyle = {
    high: "insightHigh",
    medium: "insightMedium",
    low: "insightLow"
};

const formatLabel = (key) =>
    key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase());

const buildSupportingData = (data) => {

    return Object.entries(data).map(
        ([key, value]) => ({

            columns: [

                {
                    text: formatLabel(key),
                    width: "*",
                    style: "secondary"
                },

                {
                    text: String(value),
                    width: "auto",
                    bold: true,
                    alignment: "right"
                }
            ],

            margin: [0, 2, 0, 2]
        })
    );
};

export const buildAiInsightsSection =
    (aiReport) => {

        const content = [

            {
                text: "AI Insights",
                style: "sectionTitle"
            }
        ];

        aiReport.insights.forEach(
            (insight, index) => {

                content.push({

                    stack: [

                        {
                            text:
                                `${index + 1}. ${insight.title}`,
                            style: "cardTitle"
                        },

                        {
                            text:
                                `Severity: ${insight.severity}`,
                            style:
                                severityStyle[
                                insight.severity
                                ]
                        },

                        {
                            text:
                                insight.insight,
                            margin: [0, 5, 0, 8]
                        },

                        {
                            text: "Supporting Data",
                            style: "secondary",
                            margin: [0, 8, 0, 4]
                        },

                        ...buildSupportingData(
                            insight.supportingData
                        )
                    ],

                    margin: [0, 0, 0, 15]
                });
            }
        );

        return content;
    };