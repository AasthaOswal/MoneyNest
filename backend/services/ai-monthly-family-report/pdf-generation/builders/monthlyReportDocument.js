import { COLORS } from "../styles/colors.js"; 

import {
    buildSummarySection
} from "../components/summarySection.js";

import {
    buildAiInsightsSection
} from "../components/aiInsightsSection.js";

import {
    buildFinanceOverviewSection
} from "../components/financeOverviewSection.js";

import {
    buildCategorySection
} from "../components/categorySection.js";

import {
    buildMemberSection
} from "../components/memberSection.js";

import {styles} from "../styles/styles.js"

export const buildDocumentDefinition =
(
    reportData,
    aiReport
) => {

    return {

        pageSize: "A4",

        pageMargins: [
            40,
            40,
            40,
            40
        ],

        defaultStyle: {
            color: COLORS.text,
            fontSize: 10
        },

        styles,

        background: function () {
            return {
                canvas: [
                    {
                        type: "rect",
                        x: 0,
                        y: 0,
                        w: 595.28,
                        h: 841.89,
                        color: COLORS.bg
                    }
                ]
            };
        },

        content: [



            ...buildSummarySection(
                reportData,
                aiReport
            ),

            ...buildFinanceOverviewSection(
                reportData
            ),

            ...buildCategorySection(
                reportData
            ),

            ...buildMemberSection(
                reportData
            ),

            {
                pageBreak: "before",
                stack: buildAiInsightsSection(aiReport)
            },

            
        ]
    };
};

