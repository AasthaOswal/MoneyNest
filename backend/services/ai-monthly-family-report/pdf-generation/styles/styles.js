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
        fillColor: COLORS.surface2,
        color: COLORS.text,
        bold: true
    }

};