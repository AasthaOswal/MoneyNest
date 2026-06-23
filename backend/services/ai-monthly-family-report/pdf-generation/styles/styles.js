import { COLORS } from "./colors.js";

export const styles = {

    pageTitle: {
        fontSize: 24,
        bold: true,
        color: COLORS.primary,
        margin: [0, 0, 0, 12]
    },

    sectionTitle: {
        fontSize: 16,
        bold: true,
        color: COLORS.primary,
        margin: [0, 20, 0, 10]
    },

    cardTitle: {
        fontSize: 13,
        bold: true,
        color: COLORS.text
    },

    body: {
        fontSize: 10,
        color: COLORS.text
    },

    secondary: {
        fontSize: 9,
        color: COLORS.secondaryText
    },

    insightHigh: {
        color: COLORS.error,
        bold: true
    },

    insightMedium: {
        color: COLORS.warning,
        bold: true
    },

    insightLow: {
        color: COLORS.success,
        bold: true
    },



    tableHeader: {
        fillColor: COLORS.surface3,
        color: COLORS.text,
        bold: true,
        fontSize: 10,
        margin: [0, 4, 0, 4],
        alignment: "center"
    },

        tableCell: {
        fontSize: 9,
        color: COLORS.text,
        alignment: "center"
    },

    metricCard: {
    fillColor: COLORS.surface2,
    margin: [0, 0, 0, 0]
},

metricLabel: {
    fontSize: 9,
    color: COLORS.secondaryText,
    bold: true
},

metricValue: {
    fontSize: 16,
    bold: true,
    color: COLORS.text
},

summaryText: {
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.4
},

insightCard: {
    margin: [0, 0, 0, 15]
},

insightTitle: {
    fontSize: 13,
    bold: true,
    color: COLORS.text
},

insightText: {
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.4
},

supportingHeader: {
    fontSize: 9,
    bold: true,
    color: COLORS.primary
},

supportingKey: {
    fontSize: 9,
    color: COLORS.secondaryText
},

supportingValue: {
    fontSize: 9,
    bold: true,
    color: COLORS.text
}

};