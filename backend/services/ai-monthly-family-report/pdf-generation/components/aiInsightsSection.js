import { COLORS } from "../styles/colors.js";

const getSeverityColor = (severity) => {

    switch (severity) {

        case "high":
            return COLORS.error;

        case "medium":
            return COLORS.warning;

        default:
            return COLORS.success;
    }
};

const severityStyle = {
    high: "insightHigh",
    medium: "insightMedium",
    low: "insightLow"
};

const formatLabel = (key) =>
    key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase());

const buildSupportingTable = (data) => ({

    table: {

        widths: ["*", "auto"],

        body: Object.entries(data).map(
            ([key, value]) => [

                {
                    text: formatLabel(key),
                    style: "supportingKey"
                },

                {
                    text: String(value),
                    style: "supportingValue",
                    alignment: "right"
                }
            ]
        )
    },

    layout: {

        hLineWidth: () => 0.3,
        vLineWidth: () => 0,

        hLineColor: () => COLORS.border,

        paddingTop: () => 4,
        paddingBottom: () => 4,
        paddingLeft: () => 0,
        paddingRight: () => 0
    }
});
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

                table: {

                    widths: ["*"],

                    body: [[{

                        unbreakable: true,

                        stack: [

                            {
                                columns: [

                                    {
                                        text:
                                            `${index + 1}. ${insight.title}`,
                                        style:
                                            "insightTitle"
                                    },

                                    
                                ]
                            },

                            {
                                text:
                                    insight.insight,

                                style:
                                    "insightText",

                                margin:
                                    [0, 10, 0, 10]
                            },

                            {
                                text:
                                    "SUPPORTING DATA",

                                style:
                                    "supportingHeader",

                                margin:
                                    [0, 5, 0, 6]
                            },

                            buildSupportingTable(
                                insight.supportingData
                            )
                        ]
                    }]]
                },

                layout: {

                    fillColor: () => COLORS.surface2,

                    hLineWidth: () => 0,
                    vLineWidth: () => 0,

                    paddingTop: () => 12,
                    paddingBottom: () => 12,
                    paddingLeft: () => 12,
                    paddingRight: () => 12
                },

                margin: [0, 0, 0, 15]
            });
        }
    );

    return content;
};