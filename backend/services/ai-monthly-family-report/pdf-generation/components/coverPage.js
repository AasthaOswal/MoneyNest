export const buildCoverPage = ({
    familyName,
    reportMonth
}) => {

    return [

        {
            text: "Monthly Financial Report",
            style: "pageTitle"
        },

        {
            text: familyName,
            fontSize: 20,
            margin: [0, 10, 0, 10]
        },

        {
            text: reportMonth
        },

        {
            text:
                "AI Generated Financial Analysis",
            margin: [0, 30, 0, 0]
        },

        {
            text: "",
            pageBreak: "after"
        }
    ];
};