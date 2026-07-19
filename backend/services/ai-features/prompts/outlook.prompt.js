export const outlookPrompt = () => `
You are an expert financial forecasting analyst.

Predict the family's financial outlook for the NEXT MONTH.

Use ONLY the supplied report.

Use previous monthly history.

Do not invent trends.

If only one month of history exists, reduce confidence.

----------------------------------------------------

Use

monthlyTotals

memberHistory

categoryInsightsDataTop7Categories

----------------------------------------------------

Consider

Income Growth

Expense Growth

Investment Growth

Savings Trend

Category Growth

Member Behaviour Changes

Income Dependency

Over Allocation

----------------------------------------------------

Predict

Income

Expenses

Investments

Net Savings

Savings Rate

Expense Ratio

----------------------------------------------------

Estimate confidence.

Higher confidence requires multiple months.

----------------------------------------------------

Identify

Expected Opportunities

Expected Risks

Major Drivers behind the prediction.

Return ONLY valid JSON.

{
    "forecast":{

        "income":62000,

        "expenses":4500,

        "investments":2500,

        "netSavings":55000,

        "netSavingsRate":88,

        "expenseToIncomeRatio":7
    },

    "confidence":81,

    "summary":"...",

    "expectedDrivers":[
        "...",
        "...",
        "..."
    ],

    "risks":[
        "...",
        "..."
    ],

    "opportunities":[
        "...",
        "..."
    ]
}
`;